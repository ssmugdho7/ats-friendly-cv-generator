import { StyleSheet, Text, View } from '@react-pdf/renderer';

const FONT_MAP = { 'Arial': 'Helvetica', 'Courier-New': 'Courier', 'Garamond': 'Times-Roman', 'Georgia': 'Times-Roman', 'Palatino': 'Times-Roman', 'Verdana': 'Helvetica', 'Tahoma': 'Helvetica' };
const getFont = (family, bold) => {
    const base = FONT_MAP[family] || family || 'Times-Roman';
    if (bold) {
        if (base === 'Helvetica') return 'Helvetica-Bold';
        if (base === 'Courier') return 'Courier-Bold';
        return 'Times-Bold';
    }
    return base;
};

const Section = ({ title, font, tmpl, children }) => {
    const titleSize = font?.titleSize || 13;
    const titleWeight = font?.titleWeight || 'bold';
    const breakerSize = font?.breakerSize || 1;
    const marginBefore = font?.sectionMarginBefore ?? 8;
    const marginAfter = font?.sectionMarginAfter ?? 6;
    const accent = tmpl?.accent || '#333';
    const border = font?.sectionBreakerColor || tmpl?.border || '#888';

    const styles = StyleSheet.create({
        wrapper: {
            marginBottom: marginAfter,
        },
        section_title: {
            textTransform: 'uppercase',
            color: accent,
            fontSize: titleSize,
            fontFamily: getFont(font?.family, titleWeight === 'bold'),
            marginTop: marginBefore,
        },
        section_title_underline: {
            height: breakerSize,
            margin: '2px 0px 4px 0px',
            backgroundColor: border,
        },
    });

    return (
        <View style={styles.wrapper}>
            {title && (
                <>
                    <Text style={styles.section_title}>{title}</Text>
                    <View style={styles.section_title_underline}></View>
                </>
            )}

            {children}
        </View>
    );
};

export { getFont };
export default Section;
