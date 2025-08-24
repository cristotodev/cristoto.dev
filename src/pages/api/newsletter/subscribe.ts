import type { APIRoute } from 'astro';

export const prerender = false;

interface BrevoDOIContact {
	email: string;
	attributes?: {
		FIRSTNAME?: string;
		LASTNAME?: string;
		[key: string]: any;
	};
	listIds?: number[];
	templateId: number;
	redirectionUrl?: string;
}

interface BrevoResponse {
	id?: number;
	error?: string;
	code?: string;
	message?: string;
}

export const POST: APIRoute = async ({ request }) => {
	try {
		let body;
		try {
			body = await request.json();
		} catch (parseError) {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Datos de solicitud inválidos.'
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const { email } = body;


		if (!email || typeof email !== 'string') {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Email es requerido y debe ser una cadena válida.'
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}


		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Por favor, ingresa un correo electrónico válido.'
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const apiKey = import.meta.env.BREVO_API_KEY;
		const listId = import.meta.env.BREVO_LIST_ID;
		const templateId = import.meta.env.BREVO_DOI_TEMPLATE_ID;

		if (!apiKey) {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Error de configuración del servidor.'
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		if (!templateId || Number.isNaN(Number.parseInt(templateId))) {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Error de configuración del servidor: Template DOI no configurado.'
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}


		const contactData = {
			email: email.toLowerCase().trim(),
			templateId: Number.parseInt(templateId),
			redirectionUrl: `${new URL(request.url).origin}/gracias-newsletter`,
			includeListIds: listId && !Number.isNaN(Number.parseInt(listId)) ? [Number.parseInt(listId)] : [],
		};

		const brevoResponse = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'api-key': apiKey,
			},
			body: JSON.stringify(contactData),
		});

		const brevoData: BrevoResponse = await brevoResponse.json();


		if (brevoResponse.ok) {
			return new Response(
				JSON.stringify({
					success: true,
					message: 'Te hemos enviado un correo de confirmación. Revisa tu bandeja de entrada y haz clic en el enlace para completar tu suscripción.'
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		if (brevoData.code === 'duplicate_parameter') {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Este correo electrónico ya está suscrito a nuestra newsletter.'
				}),
				{
					status: 409,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		// Return more specific error information for debugging
		const errorMessage = brevoData.message || brevoData.error || 'Error desconocido de Brevo';
		return new Response(
			JSON.stringify({
				success: false,
				error: `Error al procesar la suscripción: ${errorMessage}`,
				details: brevoData // Remove in production
			}),
			{
				status: brevoResponse.status,
				headers: { 'Content-Type': 'application/json' }
			}
		);

	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				error: 'Error interno del servidor.'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};