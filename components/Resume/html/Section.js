import { Text, View, getFontCSS } from './Renderer';

const Section = ({ title, font, tmpl, children }) => {
    const marginBefore = font?.sectionMarginBefore ?? 6;
    const marginAfter = font?.sectionMarginAfter ?? 4;
    const accent = tmpl?.accent || '#333';
    const border = tmpl?.border || '#888';

    return (
        <View style={{ marginBottom: marginAfter }}>
            {title && (
                <>
                    <Text
                        style={{
                            textTransform: 'uppercase',
                            color: accent,
                            fontSize: font?.titleSize || 13,
                            fontFamily: getFontCSS(font?.family),
                            fontWeight: 'bold',
                            marginTop: marginBefore,
                        }}
                    >
                        {title}
                    </Text>
                    <View style={{ height: 1, margin: '2px 0px 4px 0px', backgroundColor: border }}></View>
                </>
            )}

            {children}
        </View>
    );
};

export default Section;
