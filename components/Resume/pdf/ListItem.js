import { Text, View, StyleSheet } from '@react-pdf/renderer';

const FONT_MAP = { 'Arial': 'Helvetica', 'Courier-New': 'Courier', 'Garamond': 'Times-Roman', 'Georgia': 'Times-Roman', 'Palatino': 'Times-Roman', 'Verdana': 'Helvetica', 'Tahoma': 'Helvetica' };
const getFont = (family) => FONT_MAP[family] || family || 'Times-Roman';

const ListItem = ({ children, font, tmpl }) => {
    const bulletColor = tmpl?.text || '#444';

    return (
        <View style={styles.row}>
            <View style={styles.bullet}>
                <Text style={{ fontFamily: getFont(font?.family), color: bulletColor }}>{'\u2022' + ' '}</Text>
            </View>
            <Text style={{ fontFamily: getFont(font?.family), color: tmpl?.text || '#444' }}>{children}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    bullet: {
        height: '100%',
    },
});

export default ListItem;
