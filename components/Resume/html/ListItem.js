import { getFontCSS } from './Renderer';

const ListItem = ({ children, font, tmpl }) => {
    const bulletColor = tmpl?.text || '#444';

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ height: '100%' }}>
                <p style={{ fontFamily: getFontCSS(font?.family), color: bulletColor }}>{'\u2022' + ' '}</p>
            </div>
            <p style={{ fontFamily: getFontCSS(font?.family), color: tmpl?.text || '#444' }}>{children}</p>
        </div>
    );
};

export default ListItem;
