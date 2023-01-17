import { ReactNode } from 'react';
import StrKits from 'strkits';

namespace React {
    // @audit private types
    type FragmentComponent = typeof Fragment;

    type FunctionComponent = (
        props: Readonly<{
            [p: string]: any;
            children: Children;
        }>,
    ) => Element;

    type TSSRReactComponent = string | FunctionComponent | FragmentComponent;

    // @audit export types
    // export type JSXAsChildren<T extends unknown> = ReactChildren;

    export interface BaseProps {
        children: ReactNode;
        className?: string;
    }

    export type InfinityNested<T> = (T | InfinityNested<T>)[];

    export type PropsWithChildren<T> = T & {
        children: JSX.Element[];
    };

    export interface CSSProperties {
        [p: string]: string | number;
    }

    export interface Attributes {
        [p: string]: unknown;
    }

    export type TextElement = string | number | null | undefined;

    export interface FragmentElement {
        children: Children;
    }

    export interface PureHtmlElement {
        name: string;
        attributes: Attributes;
        children: Children;
    }

    export type Element = PureHtmlElement | FragmentElement | TextElement;

    export type Children = (Element | Children)[];

    // @audit Declaration

    const DOCTYPE_HTML = '<!DOCTYPE html>';
    const VOID_TAGS = [
        'area',
        'base',
        'br',
        'col',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr',
    ];

    export const Fragment = Symbol('TSSRReact Fragment');

    // export methods

    export function mkResult<T>(callbackFn: () => T): T {
        return callbackFn();
    }

    export function flatForEach<T>(arr: InfinityNested<T>, callbackFn: (value: T) => any) {
        for (const elmnt of arr) {
            if (Array.isArray(elmnt)) {
                flatForEach(elmnt, callbackFn);
                continue;
            }
            callbackFn(elmnt);
        }
    }

    export function createElement(
        component: TSSRReactComponent,
        props: unknown,
        ...children: Children
    ): Element {
        // Object.freeze(children);
        switch (typeof component) {
            case 'string': {
                return {
                    name: component,
                    attributes: propsToAttributes(props),
                    children,
                } as PureHtmlElement;
            }
            case 'function': {
                return component(
                    Object.freeze({
                        ...(props as any),
                        children,
                    }),
                );
            }
            case 'symbol': {
                if (component !== Fragment) {
                    throw new Error('[SSRReact] Invalid Fragment');
                }

                return {
                    children,
                } as FragmentElement;
            }
            default: {
                throw new Error('[SSRReact] Invalid component type');
            }
        }
    }

    // @audit render

    export interface RenderOptions {
        html5: boolean;
    }

    const renderDefaultOptions: RenderOptions = Object.freeze({
        html5: true,
    } as RenderOptions) as RenderOptions;

    export function render(jsxElement: JSX.Element, _options?: Partial<RenderOptions>) {
        const element: unknown = jsxElement;

        if (!isElement(element)) {
            throw new Error('[TSSRReact] Not support render this element');
        }

        const options: RenderOptions = {
            ..._options,
            ...renderDefaultOptions,
        };

        const results: string[] = [];

        if (options.html5) {
            results.push(DOCTYPE_HTML);
        }

        if (isNullOrUndefined(element)) {
            return results.join(' ');
        }

        if (elementIsTextElement(element)) {
            results.push(String(element).trim());
            return results.join(' ');
        }

        renderElement(element, results);
        return results.join('');
    }

    export function childIsElement(v: React.Element | React.Children): v is React.Element {
        return typeof v === 'object' && Array.isArray(v) === false;
    }

    export function elementIsTextElement(v: Element): v is TextElement {
        const vType = typeof v;
        return vType === 'string' || vType === 'number' || v === undefined || v === null;
    }

    export function elementIsPureHtmlElement(v: Element): v is PureHtmlElement {
        return (
            typeof v === 'object' &&
            v !== null &&
            'name' in v &&
            'attributes' in v &&
            'children' in v
        );
    }

    export function elementIsFragmentElement(v: Element): v is FragmentElement {
        return (
            typeof v === 'object' &&
            v !== null &&
            'name' in v === false &&
            'attributes' in v === false &&
            'children' in v
        );
    }

    // @audit private

    function isNullOrUndefined(v: unknown): v is null | undefined {
        return v === undefined || v === null;
    }

    function isVoidTag(v: string): boolean {
        return VOID_TAGS.includes(v);
    }

    function isElement(v: unknown): v is Element {
        switch (typeof v) {
            case 'string': {
                return true;
            }
            case 'object': {
                if (!v) return false;

                return 'children' in v;
            }
            default: {
                return false;
            }
        }
    }

    function propsToAttributes(props: unknown): Attributes {
        if (!props) return {};
        return props as any;
    }

    function processingStyleDeclarationValue(v: string | number): string {
        switch (typeof v) {
            case 'string': {
                return v.replaceAll('"', "'");
            }
            case 'number': {
                return String(v) + 'px';
            }
            default: {
                throw new Error(
                    `[TSSRReact] processingStyleDeclarationValue have an error with type: ${typeof v}`,
                );
            }
        }
    }

    function transformCSSPropertiesToString(cssProperties: CSSProperties): string {
        if (typeof cssProperties !== 'object') {
            throw new Error('[TSSRReact]');
        }

        const results: string[] = Object.keys(cssProperties).map((key) => {
            let declarationName: string;
            let declarationValue: string;

            if (key.startsWith('--')) {
                declarationName = key;
                declarationValue = String(cssProperties[key]).replaceAll('"', "'");
            } else {
                declarationName = StrKits.transform.toKebabCase(key);
                declarationValue = processingStyleDeclarationValue(cssProperties[key]);
            }

            return `${declarationName}: ${declarationValue}`;
        });

        return results.join('; ');
    }

    function combineAttributeToString(name: string, value: string): string {
        return `${name}="${value}"`;
    }

    function attributesToString(attributes: Attributes): string | null {
        const keys = Object.keys(attributes);

        if (keys.length === 0) {
            return null;
        }

        const results: string[] = keys.reduce((sum, key) => {
            const value = attributes[key];
            switch (key) {
                case 'className': {
                    sum.push(combineAttributeToString('class', value as string));
                    return sum;
                }
                case 'style': {
                    sum.push(
                        combineAttributeToString(
                            'style',
                            transformCSSPropertiesToString(value as CSSProperties),
                        ),
                    );
                    return sum;
                }
                default: {
                    sum.push(
                        combineAttributeToString(StrKits.transform.toKebabCase(key), String(value)),
                    );
                    return sum;
                }
            }
        }, [] as string[]);

        return results.join(' ');
    }

    interface ElementNameToHtmlTagReturn {
        startTag: string;
        endTag?: string;
    }

    function elementNameToHtmlTag(
        name: string,
        attributes: Attributes,
    ): ElementNameToHtmlTagReturn {
        const strAttributes = attributesToString(attributes);

        if (isVoidTag(name)) {
            return {
                startTag: isNullOrUndefined(strAttributes)
                    ? `<${name} />`
                    : `<${name} ${strAttributes} />`,
            };
        }
        return {
            startTag: isNullOrUndefined(strAttributes) ? `<${name}>` : `<${name} ${strAttributes}>`,
            endTag: `</${name}>`,
        };
    }

    function renderElement(_elmnt: Exclude<Element, TextElement>, sum: string[]): string[] {
        if (typeof _elmnt !== 'object') {
            console.log(_elmnt);
            throw new Error('[renderElement] Not support render this element.');
        }

        const elmnt = _elmnt as PureHtmlElement;

        let endTag: string | undefined = undefined;

        if ('name' in _elmnt) {
            const { startTag, endTag: _endTag } = elementNameToHtmlTag(
                elmnt.name,
                elmnt.attributes,
            );
            sum.push(startTag);

            // * case: void tag
            if (!_endTag) {
                return sum;
            }
            endTag = _endTag;
        }

        // * --
        flatForEach(elmnt.children, (child) => {
            switch (typeof child) {
                case 'string': {
                    sum.push(child);
                    return;
                }
                case 'number': {
                    sum.push(child.toString());
                    return;
                }
                case 'object': {
                    if (child === null) return;
                    renderElement(child, sum);
                    return;
                }
                case 'undefined': {
                    return;
                }
                default: {
                    throw new Error('[renderElement] Invalid type of element !');
                }
            }
        });

        if (endTag) {
            sum.push(endTag);
        }

        return sum;
    }
}

export default React;
