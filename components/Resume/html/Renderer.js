const FONT_CSS = {
    'Times-Roman': '"Times New Roman", Times, serif',
    Georgia: 'Georgia, "Times New Roman", Times, serif',
    Garamond: 'Garamond, "Times New Roman", Times, serif',
    Palatino: 'Palatino, "Times New Roman", Times, serif',
    Helvetica: 'Helvetica, Arial, sans-serif',
    Arial: 'Arial, Helvetica, sans-serif',
    Verdana: 'Verdana, Arial, Helvetica, sans-serif',
    Tahoma: 'Tahoma, Arial, Helvetica, sans-serif',
    Courier: '"Courier New", Courier, monospace',
    'Courier-New': '"Courier New", Courier, monospace',
};

const getFontCSS = family => FONT_CSS[family] || FONT_CSS['Times-Roman'];

const View = ({ children, style }) => <div style={style}>{children}</div>;
const Text = ({ children, style }) => <p style={style}>{children}</p>;
const Link = ({ children, src, style }) => (
    <a href={src} style={{ textDecoration: 'none', ...style }}>
        {children}
    </a>
);

const linkStyle = (font, tmpl) => ({
    color: font?.linkColor || tmpl?.accent || '#555555',
    textDecoration: font?.linkUnderline ? 'underline' : 'none',
});

const RichSegments = ({ text, font }) => (
    <>
        {parseRich(text).map((seg, i) => (
            <span
                key={i}
                style={{
                    fontWeight: seg.bold ? 'bold' : undefined,
                    ...(seg.color ? { color: seg.color } : {}),
                    fontFamily: getFontCSS(font?.family),
                }}
            >
                {seg.t}
            </span>
        ))}
    </>
);

import { parseRich } from '@/utils/richText';

export { View, Text, Link, RichSegments, getFontCSS, linkStyle };
