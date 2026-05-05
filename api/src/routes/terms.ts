/**
 * @swagger
 * tags:
 *   name: Terms
 *   description: Terms and Conditions download endpoint
 */

/**
 * @swagger
 * /api/terms/download:
 *   get:
 *     summary: Download the Terms and Conditions document
 *     tags: [Terms]
 *     parameters:
 *       - in: query
 *         name: lang
 *         required: false
 *         schema:
 *           type: string
 *           enum: [en, fr, de, es, it, pt, ja]
 *           default: en
 *         description: Language code for the Terms and Conditions document
 *     responses:
 *       200:
 *         description: Terms and Conditions document
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Unsupported language
 *       403:
 *         description: Access denied for automated crawlers
 */

import express from 'express';
import { botProtection } from '../middleware/botProtection';

const router = express.Router();

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es', 'it', 'pt', 'ja'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const termsContent: Record<SupportedLanguage, string> = {
  en: `OCTOCAT SUPPLY — TERMS AND CONDITIONS
Last updated: May 2025

1. ACCEPTANCE OF TERMS
By accessing and using the OctoCAT Supply website and services, you accept and agree to be bound by
these Terms and Conditions. If you do not agree, please discontinue use immediately.

2. USE OF SERVICES
You agree to use OctoCAT Supply services only for lawful purposes and in a manner that does not
infringe the rights of others or restrict or inhibit anyone's use and enjoyment of the services.

3. INTELLECTUAL PROPERTY
All content on this website, including text, images, graphics, and software, is the property of
OctoCAT Supply and is protected by applicable intellectual property laws.

4. PRODUCT INFORMATION
We strive to display accurate product information, but we do not warrant that descriptions or other
content are error-free. OctoCAT Supply reserves the right to correct errors or update information
at any time without prior notice.

5. LIMITATION OF LIABILITY
OctoCAT Supply shall not be liable for any indirect, incidental, special, or consequential damages
arising from your use of our services or products.

6. PRIVACY
Your use of OctoCAT Supply is also governed by our Privacy Policy, which is incorporated by
reference into these Terms and Conditions.

7. GOVERNING LAW
These Terms and Conditions are governed by and construed in accordance with applicable laws.

8. CHANGES TO TERMS
OctoCAT Supply reserves the right to modify these Terms and Conditions at any time. Continued use
of our services after changes constitutes acceptance of the revised terms.

Contact: legal@octocat.supply`,

  fr: `OCTOCAT SUPPLY — CONDITIONS GÉNÉRALES D'UTILISATION
Dernière mise à jour : mai 2025

1. ACCEPTATION DES CONDITIONS
En accédant aux services OctoCAT Supply et en les utilisant, vous acceptez d'être lié par les
présentes Conditions Générales. Si vous n'acceptez pas ces conditions, veuillez cesser d'utiliser
les services immédiatement.

2. UTILISATION DES SERVICES
Vous vous engagez à utiliser les services OctoCAT Supply uniquement à des fins légales et d'une
manière qui ne porte pas atteinte aux droits des autres.

3. PROPRIÉTÉ INTELLECTUELLE
Tout le contenu de ce site, y compris les textes, images, graphiques et logiciels, est la propriété
d'OctoCAT Supply et est protégé par les lois sur la propriété intellectuelle applicables.

4. INFORMATIONS SUR LES PRODUITS
Nous nous efforçons d'afficher des informations exactes sur les produits, mais nous ne garantissons
pas que les descriptions soient sans erreur.

5. LIMITATION DE RESPONSABILITÉ
OctoCAT Supply ne saurait être tenu responsable des dommages indirects, accessoires ou consécutifs
résultant de votre utilisation de nos services.

6. CONFIDENTIALITÉ
Votre utilisation d'OctoCAT Supply est également régie par notre Politique de Confidentialité.

7. DROIT APPLICABLE
Les présentes Conditions Générales sont régies par le droit applicable.

8. MODIFICATIONS
OctoCAT Supply se réserve le droit de modifier les présentes Conditions à tout moment.

Contact : legal@octocat.supply`,

  de: `OCTOCAT SUPPLY — ALLGEMEINE GESCHÄFTSBEDINGUNGEN
Zuletzt aktualisiert: Mai 2025

1. ANNAHME DER BEDINGUNGEN
Durch den Zugriff auf OctoCAT Supply und dessen Nutzung stimmen Sie diesen Allgemeinen
Geschäftsbedingungen zu. Falls Sie nicht zustimmen, stellen Sie die Nutzung sofort ein.

2. NUTZUNG DER DIENSTE
Sie verpflichten sich, die OctoCAT Supply-Dienste nur für rechtmäßige Zwecke zu nutzen.

3. GEISTIGES EIGENTUM
Alle Inhalte dieser Website sind Eigentum von OctoCAT Supply und durch die geltenden Gesetze
zum Schutz des geistigen Eigentums geschützt.

4. PRODUKTINFORMATIONEN
Wir bemühen uns um genaue Produktinformationen, übernehmen jedoch keine Garantie für die
Fehlerfreiheit der Beschreibungen.

5. HAFTUNGSBESCHRÄNKUNG
OctoCAT Supply haftet nicht für mittelbare, zufällige oder Folgeschäden, die aus der Nutzung
unserer Dienste entstehen.

6. DATENSCHUTZ
Ihre Nutzung von OctoCAT Supply unterliegt auch unserer Datenschutzrichtlinie.

7. ANWENDBARES RECHT
Diese Allgemeinen Geschäftsbedingungen unterliegen dem anwendbaren Recht.

8. ÄNDERUNGEN
OctoCAT Supply behält sich das Recht vor, diese Bedingungen jederzeit zu ändern.

Kontakt: legal@octocat.supply`,

  es: `OCTOCAT SUPPLY — TÉRMINOS Y CONDICIONES
Última actualización: mayo de 2025

1. ACEPTACIÓN DE LOS TÉRMINOS
Al acceder y utilizar los servicios de OctoCAT Supply, usted acepta quedar vinculado por estos
Términos y Condiciones. Si no está de acuerdo, deje de usar los servicios de inmediato.

2. USO DE LOS SERVICIOS
Usted acepta utilizar los servicios de OctoCAT Supply únicamente para fines lícitos.

3. PROPIEDAD INTELECTUAL
Todo el contenido de este sitio web es propiedad de OctoCAT Supply y está protegido por las leyes
de propiedad intelectual aplicables.

4. INFORMACIÓN DE PRODUCTOS
Nos esforzamos por mostrar información precisa sobre los productos, pero no garantizamos que las
descripciones estén libres de errores.

5. LIMITACIÓN DE RESPONSABILIDAD
OctoCAT Supply no será responsable de daños indirectos, incidentales o consecuentes derivados del
uso de nuestros servicios.

6. PRIVACIDAD
Su uso de OctoCAT Supply también se rige por nuestra Política de Privacidad.

7. LEY APLICABLE
Estos Términos y Condiciones se rigen por la ley aplicable.

8. CAMBIOS
OctoCAT Supply se reserva el derecho de modificar estos Términos en cualquier momento.

Contacto: legal@octocat.supply`,

  it: `OCTOCAT SUPPLY — TERMINI E CONDIZIONI
Ultimo aggiornamento: maggio 2025

1. ACCETTAZIONE DEI TERMINI
Accedendo e utilizzando i servizi di OctoCAT Supply, l'utente accetta di essere vincolato da questi
Termini e Condizioni. In caso contrario, è necessario cessare immediatamente l'uso dei servizi.

2. UTILIZZO DEI SERVIZI
L'utente si impegna a utilizzare i servizi di OctoCAT Supply esclusivamente per scopi leciti.

3. PROPRIETÀ INTELLETTUALE
Tutti i contenuti di questo sito sono di proprietà di OctoCAT Supply e sono protetti dalle leggi
applicabili sulla proprietà intellettuale.

4. INFORMAZIONI SUI PRODOTTI
Ci impegniamo a fornire informazioni accurate sui prodotti, ma non garantiamo che le descrizioni
siano prive di errori.

5. LIMITAZIONE DI RESPONSABILITÀ
OctoCAT Supply non sarà responsabile per danni indiretti, incidentali o consequenziali derivanti
dall'uso dei nostri servizi.

6. PRIVACY
L'uso di OctoCAT Supply è disciplinato anche dalla nostra Informativa sulla Privacy.

7. LEGGE APPLICABILE
I presenti Termini e Condizioni sono regolati dalla legge applicabile.

8. MODIFICHE
OctoCAT Supply si riserva il diritto di modificare i presenti Termini in qualsiasi momento.

Contatto: legal@octocat.supply`,

  pt: `OCTOCAT SUPPLY — TERMOS E CONDIÇÕES
Última atualização: maio de 2025

1. ACEITAÇÃO DOS TERMOS
Ao acessar e usar os serviços da OctoCAT Supply, você concorda em estar vinculado a estes Termos
e Condições. Se não concordar, cesse o uso dos serviços imediatamente.

2. USO DOS SERVIÇOS
Você concorda em usar os serviços da OctoCAT Supply apenas para fins lícitos.

3. PROPRIEDADE INTELECTUAL
Todo o conteúdo deste site é propriedade da OctoCAT Supply e está protegido pelas leis de
propriedade intelectual aplicáveis.

4. INFORMAÇÕES SOBRE PRODUTOS
Esforçamo-nos para exibir informações precisas sobre os produtos, mas não garantimos que as
descrições estejam isentas de erros.

5. LIMITAÇÃO DE RESPONSABILIDADE
A OctoCAT Supply não será responsável por danos indiretos, incidentais ou consequenciais
decorrentes do uso dos nossos serviços.

6. PRIVACIDADE
O uso da OctoCAT Supply também é regido pela nossa Política de Privacidade.

7. LEI APLICÁVEL
Estes Termos e Condições são regidos pela lei aplicável.

8. ALTERAÇÕES
A OctoCAT Supply reserva-se o direito de modificar estes Termos a qualquer momento.

Contato: legal@octocat.supply`,

  ja: `オクトキャット・サプライ — 利用規約
最終更新日：2025年5月

1. 規約への同意
OctoCAT Supplyのウェブサイトおよびサービスにアクセスし利用することで、本利用規約に同意したものとみなされます。
同意されない場合は、直ちに利用を中止してください。

2. サービスの利用
お客様は、OctoCAT Supplyのサービスを合法的な目的のみに使用することに同意するものとします。

3. 知的財産
このウェブサイトのすべてのコンテンツ（テキスト、画像、ソフトウェアを含む）は、OctoCAT Supplyの財産であり、
適用される知的財産法によって保護されています。

4. 製品情報
製品情報の正確な表示に努めていますが、説明文にエラーがないことを保証するものではありません。

5. 責任の制限
OctoCAT Supplyは、当社のサービスの利用から生じる間接的・付随的・結果的損害について責任を負いません。

6. プライバシー
OctoCAT Supplyのご利用は、プライバシーポリシーにも準拠します。

7. 準拠法
本利用規約は適用される法律に準拠します。

8. 規約の変更
OctoCAT Supplyは、いつでも本規約を変更する権利を留保します。

お問い合わせ：legal@octocat.supply`,
};

router.get('/download', botProtection, (req, res) => {
  const lang = (req.query.lang as string) ?? 'en';

  if (!SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    res.status(400).json({
      error: `Unsupported language: "${lang}". Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}.`,
    });
    return;
  }

  const content = termsContent[lang as SupportedLanguage];
  const filename = `terms-and-conditions-${lang}.txt`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(content);
});

export default router;
