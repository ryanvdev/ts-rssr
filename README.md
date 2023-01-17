# Table of contents

- [Table of contents](#table-of-contents)
- [Introduction](#introduction)
- [Required - VERY IMPORTANT](#required---very-important)
- [In your code](#in-your-code)
- [Rendering](#rendering)

# Introduction

- Very fast
- Renter to `pure html`


# Required - <span style="color: orange;">VERY IMPORTANT</span>  

Config your `tsconfig.json`

  - `module: CommonJs`   - Build for nodejs.
  - `target: ES2021`     - For methods like replaceAll, padEnd, flatMap, etc.
  - `jsx: react`         - Specify what JSX code is generated.


# In your code
```tsx
import React from 'ts-rssr'; // ! IMPORTANT

export interface IHomePageProps {
    // Your code here...
}

export function HomePage(props: IHomePageProps) {
    return (
        <html lang='en'>
            <head>
                <meta charSet='UTF-8' />
                <meta http-equiv='X-UA-Compatible' content='IE=edge' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <title>Home</title>
            </head>
            <body>
                <main>
                    {/* Your code here */}
                </main>
            </body>
        </html>
    );
}

```


# Rendering

```ts
import React from 'ts-rssr'; // ! IMPORTANT

const pureHtml:string = React.render(HomePage({
    // your props
}));

```