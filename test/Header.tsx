import React from "../src";

export interface IHeaderProps extends React.BaseProps {
    label:string;
}

export function Header (props: IHeaderProps) { 
    return (
        <header
            style={{
                backgroundColor: 'blue',
                'border-radius': ''
            } as React.CSSProperties}
        >
            <div>{props.label}</div>
            <div>
                {props.children}
            </div>
        </header>
    );
}
