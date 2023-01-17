import pyRange from 'py-range-ts';
import React from '../src'; // ! IMPORTANT
import Footer from './Footer';
import { Header } from './Header';

export interface IHomePageProps {
    numberOfElements?:number;
}

export function HomePage(props: IHomePageProps) {
    const lis:JSX.Element[] = pyRange(props.numberOfElements || 10).map(value => {
        return (
            <li>
                Item {value}
            </li>
        );
    });

    return (
        <html lang='en'>
            <head>
                <meta charSet='UTF-8' />
                <meta http-equiv='X-UA-Compatible' content='IE=edge' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <title>Home</title>
            </head>
            <body>
                <Header label='Home Page'>
                    <div>
                        This is a child element
                    </div>
                    <section>
                        This is a child element
                    </section>
                </Header>
                <main>
                    <h1
                        style={{
                            display: 'block',
                            backgroundColor: 'blue',
                            width: 200,
                            height: 300,
                            '--css-variable': 'ok'
                        } as React.CSSProperties}
                    >
                        Home Page</h1>
                    <ul>
                        {lis}
                    </ul>
                </main>
                <Footer>
                    Footer children....
                </Footer>
            </body>
        </html>
    );
}
