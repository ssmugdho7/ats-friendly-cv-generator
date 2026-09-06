import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    ExternalHyperlink,
    Tab,
    TabStopType,
    AlignmentType,
    BorderStyle,
} from 'docx';
import { parseRich, normUrl } from './richText';
import { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { TEMPLATES } from '@/config/templates';
import { resolvePlaceholders, buildTokenMap } from '@/utils/placeholders';
import formatDate from './formatDate';

const A4_WIDTH = 11906;
const A4_HEIGHT = 16838;
const LETTER_WIDTH = 12240;
const LETTER_HEIGHT = 15840;
const MARGIN = 720;

const ptToTwips = pt => Math.round(pt * 20);

const getPaperDimensions = (paperSize = 'A4') => {
    if (paperSize === 'Letter') return { width: LETTER_WIDTH, height: LETTER_HEIGHT };
    return { width: A4_WIDTH, height: A4_HEIGHT };
};

const DOCX_FONT_MAP = {
    'Times-Roman': 'Times New Roman',
    Georgia: 'Georgia',
    Garamond: 'Garamond',
    Palatino: 'Palatino',
    Helvetica: 'Helvetica',
    Arial: 'Arial',
    Verdana: 'Verdana',
    Tahoma: 'Tahoma',
    Courier: 'Courier New',
    'Courier-New': 'Courier New',
};

const toDocxColor = css => {
    if (!css) return undefined;
    let c = String(css).trim().replace('#', '');
    if (/^[0-9a-fA-F]{3}$/.test(c)) c = c
        .split('')
        .map(ch => ch + ch)
        .join('');
    return /^[0-9a-fA-F]{6}$/.test(c) ? c.toUpperCase() : undefined;
};

const runs = (text, base = {}) =>
    parseRich(resolvePlaceholders(text, base._data || {})).map(
        seg =>
            new TextRun({
                text: seg.t,
                bold: seg.bold || base.bold || undefined,
                italics: base.italics || undefined,
                color: toDocxColor(seg.color) || base.color,
                size: base.size,
                font: base.font,
            }),
    );

const hyperlink = (label, url, size = 20, font, tmpl) => {
    const docxFont = DOCX_FONT_MAP[font?.family] || 'Times New Roman';
    const linkColor = toDocxColor(font?.linkColor) || toDocxColor(tmpl?.accent) || '555555';
    const underline = font?.linkUnderline ? { type: 'single' } : undefined;
    return new ExternalHyperlink({
        link: /^(mailto:|tel:|https?:\/\/)/i.test(url) ? url : normUrl(url),
        children: [new TextRun({ text: label, color: linkColor, size, font: docxFont, underline })],
    });
};

const heading = (title, font, tmpl) => {
    const titleSize = font?.titleSize ? font.titleSize * 2 : 26;
    const marginBefore = font?.sectionMarginBefore ? font.sectionMarginBefore * 20 : 240;
    const marginAfter = font?.sectionMarginAfter ? font.sectionMarginAfter * 20 : 80;
    const accentColor = toDocxColor(tmpl?.accent) || '333333';
    const borderColor = toDocxColor(tmpl?.border) || '888888';
    return new Paragraph({
        children: [
            new TextRun({
                text: String(title).toUpperCase(),
                bold: true,
                size: titleSize,
                color: accentColor,
                font: DOCX_FONT_MAP[font?.family] || 'Times New Roman',
            }),
        ],
        spacing: { before: marginBefore, after: marginAfter },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: borderColor } },
    });
};

const titleRow = (leftChildren, rightChildren, contentWidth) =>
    new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: contentWidth }],
        spacing: { before: 140, after: 0 },
        children: [...leftChildren, new Tab(), ...rightChildren],
    });

const dateRun = (text, font) =>
    new TextRun({
        text: text || '',
        italics: true,
        size: 20,
        color: '555555',
        font: DOCX_FONT_MAP[font?.family] || 'Times New Roman',
    });

const descriptionParas = (text, bullets, font, tmpl, data) => {
    const descSize = font?.descSize ? font.descSize * 2 : (font?.size ? font.size * 2 : 20);
    const docxFont = DOCX_FONT_MAP[font?.family] || 'Times New Roman';
    const textColor = toDocxColor(tmpl?.text) || '555555';
    const resolved = resolvePlaceholders(text, data);
    const lines = String(resolved || '')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    if (!lines.length) return [];
    if (bullets === false) {
        return lines.map(
            line =>
                new Paragraph({
                    spacing: { before: 40, after: 0 },
                    children: runs(line, { size: descSize, color: textColor, font: docxFont, _data: data }),
                }),
        );
    }
    return lines.map(
        line =>
            new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 20, after: 20 },
                children: runs(line, { size: descSize, color: textColor, font: docxFont, _data: data }),
            }),
    );
};

const buildHeader = (contact = {}, tagline = '', font, tmpl, data) => {
    const docxFont = DOCX_FONT_MAP[font?.family] || 'Times New Roman';
    const nameSize = font?.nameSize ? font.nameSize * 2 : 40;
    const nameColor = toDocxColor(tmpl?.text) || '111111';

    const out = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
                new TextRun({
                    text: resolvePlaceholders(contact.name, data) || 'Resume',
                    bold: true,
                    size: nameSize,
                    color: nameColor,
                    font: docxFont,
                }),
            ],
        }),
    ];

    if (tagline && String(tagline).trim()) {
        out.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [
                    new TextRun({
                        text: resolvePlaceholders(String(tagline).trim(), data),
                        italics: true,
                        size: 24,
                        color: '444444',
                        font: docxFont,
                    }),
                ],
            }),
        );
    }

    const items = [];
    const pushLink = (label, url) => {
        if (!label || !url) return;
        if (items.length) items.push(new TextRun({ text: '   |   ', color: '999999', size: 20, font: docxFont }));
        items.push(hyperlink(label, url, 20, font, tmpl));
    };
    if (contact.phone) {
        if (items.length) items.push(new TextRun({ text: '   |   ', color: '999999', size: 20, font: docxFont }));
        items.push(hyperlink(contact.phone, `tel:${contact.phone}`, 20, font, tmpl));
    }
    pushLink(contact.email, contact.email ? `mailto:${contact.email}` : '');
    ['linkedin', 'github', 'blogs', 'twitter', 'portfolio'].forEach(k => {
        const label = k === 'linkedin' ? 'LinkedIn' : k === 'github' ? 'Github' : k[0].toUpperCase() + k.slice(1);
        pushLink(label, contact[k] || '');
    });
    if (items.length) {
        out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: items }));
    }
    return out;
};

const buildSections = (data, contentWidth) => {
    const out = [];
    const order = Array.isArray(data.sectionOrder) && data.sectionOrder.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
    const font = data.font;
    const tmpl = TEMPLATES[data.template] || TEMPLATES.classic;
    const docxFont = DOCX_FONT_MAP[font?.family] || 'Times New Roman';
    const descSize = font?.descSize ? font.descSize * 2 : (font?.size ? font.size * 2 : 20);
    const textColor = toDocxColor(tmpl?.text) || '555555';

    for (const key of order) {
        if (key === 'summary') {
            if (!data.summary?.summary) continue;
            out.push(heading('Summary', font, tmpl));
            out.push(
                new Paragraph({
                    spacing: { after: 80 },
                    children: runs(data.summary.summary, { size: descSize, color: textColor, font: docxFont, _data: data }),
                }),
            );
        } else if (key === 'education') {
            if (!data.education?.length) continue;
            out.push(heading('Education', font, tmpl));
            data.education.forEach(edu => {
                out.push(
                    titleRow(
                        [new TextRun({ text: resolvePlaceholders(edu.degree || '', data), bold: true, size: descSize + 4, color: textColor, font: docxFont })],
                        [dateRun(`${formatDate(edu.start)}- ${formatDate(edu.end)}`, font)],
                        contentWidth,
                    ),
                );
                const sub = [resolvePlaceholders(edu.institution || '', data), edu.gpa ? ` (${resolvePlaceholders(edu.gpa, data)})` : '', edu.location ? `   ${resolvePlaceholders(edu.location, data)}` : '']
                    .join('')
                    .trim();
                if (sub) {
                    out.push(
                        new Paragraph({
                            spacing: { after: 80 },
                            children: [new TextRun({ text: sub, size: descSize, color: textColor, font: docxFont })],
                        }),
                    );
                }
            });
        } else if (key === 'experience') {
            if (!data.experience?.length) continue;
            out.push(heading('Experience', font, tmpl));
            data.experience.forEach(exp => {
                out.push(
                    titleRow(
                        [new TextRun({ text: resolvePlaceholders(exp.role || '', data), bold: true, size: descSize + 4, color: textColor, font: docxFont })],
                        [dateRun(`${formatDate(exp.start)} - ${formatDate(exp.end)}`, font)],
                        contentWidth,
                    ),
                );
                const sub = [resolvePlaceholders(exp.company || '', data), exp.location ? `   ${resolvePlaceholders(exp.location, data)}` : ''].join('').trim();
                if (sub) {
                    out.push(
                        new Paragraph({
                            spacing: { after: 40 },
                            children: [new TextRun({ text: sub, size: descSize, color: textColor, font: docxFont })],
                        }),
                    );
                }
                out.push(...descriptionParas(exp.description, exp.bullets, font, tmpl, data));
            });
        } else if (key === 'projects') {
            if (!data.projects?.length) continue;
            out.push(heading('Projects', font, tmpl));
            data.projects.forEach(proj => {
                const right = [];
                if (proj.live) {
                    right.push(hyperlink('Live Demo', proj.live, descSize + 2, font, tmpl));
                }
                if (proj.github) {
                    if (right.length) right.push(new TextRun({ text: '   ', size: descSize + 2, font: docxFont }));
                    right.push(hyperlink('Repository', proj.github, descSize + 2, font, tmpl));
                }
                out.push(
                    titleRow(
                        [new TextRun({ text: resolvePlaceholders(proj.title || '', data), bold: true, size: descSize + 4, color: textColor, font: docxFont })],
                        right,
                        contentWidth,
                    ),
                );
                if (proj.url) {
                    out.push(
                        new Paragraph({
                            spacing: { after: 40 },
                            children: [hyperlink(resolvePlaceholders(proj.url, data), resolvePlaceholders(proj.url, data), descSize, font, tmpl)],
                        }),
                    );
                }
                out.push(...descriptionParas(proj.description, proj.bullets, font, tmpl, data));
            });
        } else if (key === 'skills') {
            const groups = Array.isArray(data.skills)
                ? data.skills
                : data.skills?.skills
                  ? [{ title: 'Skills', skills: data.skills.skills }]
                  : [];
            const visible = groups.filter(g => g && (g.title || g.skills));
            if (!visible.length) continue;
            out.push(heading('Skills', font, tmpl));
            visible.forEach(group => {
                const kids = [];
                if (group.title) kids.push(new TextRun({ text: `${group.title}: `, bold: true, size: descSize + 2, font: docxFont }));
                kids.push(...runs(group.skills, { size: descSize + 2, font: docxFont, _data: data }));
                out.push(new Paragraph({ spacing: { before: 40, after: 40 }, children: kids }));
            });
        } else if (key === 'certificates') {
            if (!data.certificates?.length) continue;
            out.push(heading('Certifications', font, tmpl));
            data.certificates.forEach(cert => {
                const certTitle = resolvePlaceholders(cert.title || '', data);
                const certIssuer = resolvePlaceholders(cert.issuer || '', data);
                const titleChildren = cert.url
                    ? [hyperlink(certTitle, cert.url, descSize + 4, font, tmpl)]
                    : [new TextRun({ text: certTitle, bold: true, size: descSize + 4, color: textColor, font: docxFont })];
                out.push(
                    titleRow(
                        titleChildren,
                        [dateRun(formatDate(cert.date), font)],
                        contentWidth,
                    ),
                );
                if (certIssuer) {
                    out.push(
                        new Paragraph({
                            spacing: { after: 80 },
                            children: [new TextRun({ text: certIssuer, size: descSize, color: textColor, font: docxFont })],
                        }),
                    );
                }
            });
        } else if (key === 'languages') {
            if (!data.languages?.length) continue;
            out.push(heading('Languages', font, tmpl));
            data.languages.forEach(lang => {
                const kids = [new TextRun({ text: lang.language || '', size: descSize + 4, font: docxFont })];
                if (lang.proficiency)
                    kids.push(new TextRun({ text: ` — ${lang.proficiency}`, size: descSize, color: '777777', font: docxFont }));
                out.push(new Paragraph({ spacing: { before: 40, after: 40 }, children: kids }));
            });
        } else if (key === 'references') {
            if (!data.references?.length) continue;
            out.push(heading('References', font, tmpl));
            data.references.forEach(ref => {
                const right = [];
                if (ref.website) {
                    right.push(hyperlink('Website', ref.website, descSize, font, tmpl));
                }
                out.push(
                    titleRow(
                        [new TextRun({ text: ref.name || '', bold: true, size: descSize + 4, color: textColor, font: docxFont })],
                        right,
                        contentWidth,
                    ),
                );
                const roleCompany = [ref.role || '', ref.role && ref.company ? ' at ' : '', ref.company || ''].join('');
                if (roleCompany) {
                    out.push(
                        new Paragraph({
                            spacing: { after: 40 },
                            children: [new TextRun({ text: roleCompany, size: descSize, color: textColor, font: docxFont })],
                        }),
                    );
                }
                if (ref.contacts) {
                    const contactLines = String(ref.contacts).split('\n').filter(c => c.trim());
                    if (contactLines.length) {
                        out.push(
                            new Paragraph({
                                spacing: { after: 40 },
                                children: [new TextRun({ text: contactLines.join(' | '), size: descSize, color: textColor, font: docxFont })],
                            }),
                        );
                    }
                }
            });
        } else if (key === 'achievements') {
            if (!data.achievements?.length) continue;
            out.push(heading('Achievements', font, tmpl));
            const items = data.achievements.map(a => `${a.label}: ${a.value}`).join('   •   ');
            out.push(
                new Paragraph({
                    spacing: { after: 40 },
                    children: runs(items, { size: descSize, color: textColor, font: docxFont, _data: data }),
                }),
            );
        }
    }
    return out;
};

export async function buildResumeDocx(resume, options = {}) {
    const data = resume || {};
    const font = data.font;
    const tmpl = TEMPLATES[data.template] || TEMPLATES.classic;
    const { paperSize = 'A4', margin = 30 } = options;
    const { width: pageWidth, height: pageHeight } = getPaperDimensions(paperSize);
    const marginTwips = ptToTwips(margin);
    const contentWidth = pageWidth - marginTwips * 2;
    const tokenMap = buildTokenMap(data);
    const children = [
        ...buildHeader(data.contact, data.tagline?.tagline, font, tmpl, tokenMap),
        ...buildSections({ ...data, _tokenMap: tokenMap }, contentWidth),
    ];
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        size: { width: pageWidth, height: pageHeight },
                        margins: { top: marginTwips, bottom: marginTwips, left: marginTwips, right: marginTwips },
                    },
                },
                children,
            },
        ],
    });
    return Packer.toBlob(doc);
}

export async function downloadResumeDocx(resume, options = {}) {
    const blob = await buildResumeDocx(resume, options);
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    const name = (resume?.contact?.name || 'resume').trim() || 'resume';
    a.download = `${name}.docx`;
    window.document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}
