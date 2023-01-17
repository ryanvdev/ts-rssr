import React from "../src";
import {PropsWithChildren} from 'react';

export interface IFooterProps {
    
}

export default function Footer (props: PropsWithChildren<IFooterProps>) {
    return (
        <footer>
            {props.children}
            This is footer
        </footer>
    );
}
