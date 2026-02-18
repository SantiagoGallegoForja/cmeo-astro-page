import type { APIRoute } from 'astro';

export const prerender = false;

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fclid?: string;
  dclid?: string;
}

interface ContactPayload {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  convenio?: string;
  message?: string;
  source?: string;
  utmParams?: UTMParams;
}

// Custom Field IDs for UTMs in GHL
const UTM_FIELD_IDS = {
  utm_source: 'VKL9yoOF9lTSZtHZMO5U',
  utm_medium: 'pxwD2EAr1GSgyLiYpU5Q',
  utm_campaign: 'HUETkqNO3Rb85ipAurz5',
  utm_term: 'fK6TCMenKNLm4IU0RATu',
  utm_content: 'zfEQ4CFlj6DtMGAUpEtd',
  gclid: 'RUHIYD1KlESUrr0S0SAr',
  fclid: 'vyWxzt3TMcupLFCNInok',
  dclid: 'zkr9ysbxCNssVHQZkXah',
} as const;

// Custom Field ID for Convenio
const CONVENIO_FIELD_ID = 'YwpfSc45qvZaCpyxEHfV';

// Pipeline IDs by specialty
const PIPELINES = {
  Oftalmologia: {
    pipelineId: 'riX47hFaMmDPNs26tqLQ',
    stageId: 'e87c232f-9269-46e7-b6d9-de86dd8ea645', // Nuevo Prospecto
  },
  Otorrinolaringologia: {
    pipelineId: 'gcrEQ3VoaS2mQdCclIUL',
    stageId: '917fbca5-21a3-4289-bb1c-a30fd16437b7', // Nuevo Prospecto
  },
} as const;

// Google Sheets backup URL
const GOOGLE_SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyO6PPusGAOkecc1O_3xOMMrqM7EXbC5EsK9WaUoPdfXRvniHDc1wSQwRHVzcHgx_lQwg/exec';

// Function to send data to Google Sheets as backup
async function sendToGoogleSheets(data: ContactPayload): Promise<void> {
  try {
    const sheetsPayload = {
      nombre: data.name,
      telefono: data.phone,
      email: data.email || '',
      especialidad: data.service || '',
      convenio: data.convenio || '',
      mensaje: data.message || '',
      utm_source: data.utmParams?.utm_source || '',
      utm_medium: data.utmParams?.utm_medium || '',
      utm_campaign: data.utmParams?.utm_campaign || '',
      utm_term: data.utmParams?.utm_term || '',
      utm_content: data.utmParams?.utm_content || '',
      gclid: data.utmParams?.gclid || '',
      fclid: data.utmParams?.fclid || '',
      dclid: data.utmParams?.dclid || '',
    };

    const response = await fetch(GOOGLE_SHEETS_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetsPayload),
    });

    if (!response.ok) {
      console.error('Google Sheets backup failed:', await response.text());
    }
  } catch (error) {
    console.error('Google Sheets backup error:', error);
    // Don't throw - this is just a backup
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: ContactPayload = await request.json();

    // Validate required fields
    if (!data.name || !data.phone) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nombre y teléfono son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send to Google Sheets as backup (don't await - fire and forget)
    sendToGoogleSheets(data).catch(err => console.error('Sheets backup failed:', err));

    // Use process.env directly — import.meta.env gets replaced at build time by Vite
    // and Vercel's .env file is not available during build
    const GHL_API_KEY = process.env.GHL_API_KEY;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.error('GHL credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Error de configuración del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Split name into first and last name
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Build custom fields array with UTM data and convenio
    const customFields: Array<{ id: string; value: string }> = [];

    if (data.utmParams) {
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fclid', 'dclid'] as const;
      for (const key of utmKeys) {
        const value = data.utmParams[key];
        if (value && value.trim()) {
          customFields.push({
            id: UTM_FIELD_IDS[key],
            value: value.trim(),
          });
        }
      }
    }

    // Add convenio custom field
    if (data.convenio && data.convenio.trim()) {
      customFields.push({
        id: CONVENIO_FIELD_ID,
        value: data.convenio.trim(),
      });
    }

    // Prepare GHL contact payload
    const ghlPayload = {
      firstName,
      lastName,
      phone: data.phone,
      email: data.email || undefined,
      locationId: GHL_LOCATION_ID,
      source: data.source || 'Website Form',
      tags: ['website-lead', 'cmeo'],
      customFields,
    };

    // Add service as a tag if provided
    if (data.service) {
      ghlPayload.tags.push(data.service.toLowerCase().replace(/\s+/g, '-'));
    }

    // Add message to notes via custom field or as a separate note
    const notes = [];
    if (data.service) notes.push(`Servicio: ${data.service}`);
    if (data.convenio) notes.push(`Convenio: ${data.convenio}`);
    if (data.message) notes.push(`Mensaje: ${data.message}`);

    // Create contact in GHL
    const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify(ghlPayload),
    });

    const ghlResult = await ghlResponse.json();

    if (!ghlResponse.ok) {
      console.error('GHL API Error:', ghlResult);

      // If contact already exists, try to update it
      if (ghlResult.message?.includes('duplicate') || ghlResult.message?.includes('already exists')) {
        return new Response(
          JSON.stringify({ success: true, message: 'Contacto registrado correctamente' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Error al procesar la solicitud' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If we have notes/message and a contact was created, add a note
    if (notes.length > 0 && ghlResult.contact?.id) {
      try {
        await fetch(`https://services.leadconnectorhq.com/contacts/${ghlResult.contact.id}/notes`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
          },
          body: JSON.stringify({
            body: notes.join('\n'),
          }),
        });
      } catch (noteError) {
        console.error('Error adding note:', noteError);
        // Don't fail the whole request if note fails
      }
    }

    // Create opportunity in the appropriate pipeline based on specialty
    const contactId = ghlResult.contact?.id;
    if (contactId && data.service) {
      // Normalize the service name to match our pipeline keys
      const serviceNormalized = data.service.charAt(0).toUpperCase() + data.service.slice(1).toLowerCase();
      const pipelineConfig = PIPELINES[serviceNormalized as keyof typeof PIPELINES];

      if (pipelineConfig) {
        try {
          const opportunityPayload = {
            pipelineId: pipelineConfig.pipelineId,
            locationId: GHL_LOCATION_ID,
            name: `${firstName} ${lastName} - ${data.service}`,
            pipelineStageId: pipelineConfig.stageId,
            contactId: contactId,
            status: 'open',
          };

          const opportunityResponse = await fetch('https://services.leadconnectorhq.com/opportunities/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${GHL_API_KEY}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28',
            },
            body: JSON.stringify(opportunityPayload),
          });

          if (!opportunityResponse.ok) {
            const errorData = await opportunityResponse.json();
            console.error('Error creating opportunity:', errorData);
          }
        } catch (opportunityError) {
          console.error('Error creating opportunity:', opportunityError);
          // Don't fail the whole request if opportunity creation fails
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Contacto registrado correctamente', contactId: ghlResult.contact?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Contact API Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
