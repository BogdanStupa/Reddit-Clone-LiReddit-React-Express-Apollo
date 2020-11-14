import React, { ReactNode } from 'react';
import classNames from "classnames";


type PositionType = 'center' | 'v-center' | 'h-center'; 
type StyleType = string | number;


interface IBoxContainerProps {
    style:{
        backgroundColor?: string, 
        width?: StyleType
        maxWidth?: StyleType,
        height?: StyleType,
        maxHeight?: StyleType,
        marginTop?: StyleType,
    },
    position?: PositionType,
    colMode?: boolean,
    children?: ReactNode
};



const BoxContainer: React.FC<IBoxContainerProps> = ({position, colMode, style, children }) => {

    const styles = classNames(position, {
        'collumn': colMode
    });
    
    return (
         <div
         style={{
            backgroundColor: style.backgroundColor,
            width: style.width,
            maxWidth: style.maxWidth,
            marginTop: style.marginTop,
            height: style.height,
            maxHeight: style.maxHeight
         }}
            className={styles}
         >
            {
                children
            }
        </div>
    );
}

export default BoxContainer; 