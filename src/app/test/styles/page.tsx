"use client";

import LoremIpsum from "@/shared/components/lorem-ipsum";
import {useState} from "react";
import Image from 'next/image'
import './style-test.css'
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";

function StyleTestPage() {
    const [value, setValue] = useState("50");

    return (
        <div>
            <PageHeader
                eyebrow="Style Test"
                title="HTML Element Test Page"
                subtitle="An example of each major HTML element, for the purpose of testing out styles and themes."
                items={[
                    {
                        id: "headings",
                        label: "Headings",
                        level: 2,
                    },
                    {
                        id: "text",
                        label: "Text & Inline Semantics",
                        level: 2,
                    },
                    {
                        id: "lists",
                        label: "Lists",
                        level: 2,
                    },
                    {
                        id: "links-media",
                        label: "Links & Media",
                        level: 2,
                    },
                    {
                        id: "tables",
                        label: "Tables",
                        level: 2,
                    },
                    {
                        id: "forms",
                        label: "Forms",
                        level: 2,
                    },
                    {
                        id: "buttons",
                        label: "Buttons & Interactive",
                        level: 2,
                    },
                    {
                        id: "semantic",
                        label: "Semantic / Layout",
                        level: 2,
                    },
                    {
                        id: "embedded",
                        label: "Embedded & Misc",
                        level: 2,
                    },
                    {
                        id: "quotes-code",
                        label: "Quotes & Code",
                        level: 2,
                    },
                ]}
            />

            <MainContentPanel
                title="Headings"
                id="headings"
                description="HTML heading elements from H1 through H6.">

                <section className="test-section">
                    <div className="component-row">
                        <div className="component-tag">&lt;h1&gt;</div>
                        <h1>Heading Level 1</h1>
                    </div>
                    <div className="component-row">
                        <span className="component-tag">&lt;h2&gt;</span>
                        <h2>Heading Level 2</h2>
                    </div>
                    <div className="component-row">
                        <span className="component-tag">&lt;h3&gt;</span>
                        <h3>Heading Level 3</h3>
                    </div>
                    <div className="component-row">
                        <span className="component-tag">&lt;h4&gt;</span>
                        <h4>Heading Level 4</h4>
                    </div>
                    <div className="component-row">
                        <span className="component-tag">&lt;h5&gt;</span>
                        <h5>Heading Level 5</h5>
                    </div>
                    <div className="component-row">
                        <span className="component-tag">&lt;h6&gt;</span>
                        <h6>Heading Level 6</h6>
                    </div>
                </section>

            </MainContentPanel>

            <MainContentPanel
                title="Text & Inline Semantic"
                id="text"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">

                <section className="test-section">
                    <div className="component-row">
                        <div className="component-tag">&lt;p&gt;</div>
                        <LoremIpsum length={2} regular={true}/>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;strong&gt; / &lt;b&gt; / &lt;em&gt; / &lt;i&gt;</span>
                        <ul>
                            <li className={"list-element"}><strong>Strong importance text.</strong></li>
                            <li className={"list-element"}><b>Bold text.</b></li>
                            <li className={"list-element"}><em>Emphasized text.</em></li>
                            <li className={"list-element"}>Italic text.</li>
                        </ul>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;mark&gt; / &lt;small&gt; / &lt;u&gt; / &lt;s&gt;</span>
                        <ul>
                            <li className={"list-element"}>
                                <mark>Marked/highlighted text.</mark>
                            </li>
                            <li className={"list-element"}><small>Small print text.</small></li>
                            <li className={"list-element"}><u>Underlined text.</u></li>
                            <li className={"list-element"}><s>Strikethrough text.</s></li>
                        </ul>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;del&gt; / &lt;ins&gt;</span>
                        <ul>
                            <li className={"list-element"}>
                                <del>Deleted text.</del>
                            </li>
                            <li className={"list-element"}>
                                <ins>Inserted text.</ins>
                            </li>
                        </ul>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;sub&gt; / &lt;sup&gt;</span>
                        <ul>
                            <li className={"list-element"}>Water is H<sub>2</sub>O.</li>
                            <li className={"list-element"}> Einstein&#39;s equation is E = mc<sup>2</sup>.</li>
                        </ul>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;abbr&gt; / &lt;cite&gt; / &lt;dfn&gt;</span>
                        <p>
                            <abbr title="HyperText Markup Language">HTML</abbr> is defined by the <cite>W3C
                            specification</cite>. A <dfn>dfn element</dfn> represents a term being defined.
                        </p>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;span&gt;</span>
                        <p>A paragraph with an inline <span>span element</span> used for generic text grouping.</p>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;address&gt;</span>
                        <address>123 Test Street, Sample City, ST 00000</address>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;time&gt;</span>
                        <p>Published on <time dateTime="2026-08-27">August 27, 2026</time>.</p>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;br&gt; / &lt;hr&gt;</span>
                        <p>Line one of text.<br/>Line two after a line break.</p>
                        <hr/>
                    </div>
                </section>
            </MainContentPanel>

            <MainContentPanel
                title="Lists"
                id="lists"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">

                <section className="test-section">
                    <div className="component-row">
                        <span className="component-tag">&lt;ul&gt;</span>
                        <ul>
                            <li>Unordered list item one</li>
                            <li>Unordered list item two</li>
                            <li>Unordered list item three
                                <ul>
                                    <li>Nested item A</li>
                                    <li>Nested item B</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;ol&gt;</span>
                        <ol>
                            <li>Ordered list item one</li>
                            <li>Ordered list item two</li>
                            <li>Ordered list item three</li>
                        </ol>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;dl&gt;</span>
                        <dl>
                            <dt>Term One</dt>
                            <dd>Definition of term one.</dd>
                            <dt>Term Two</dt>
                            <dd>Definition of term two.</dd>
                        </dl>
                    </div>
                </section>
            </MainContentPanel>

            <MainContentPanel
                title="Links & Media"
                id="links-media"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">

                <section className="test-section">
                    <div className="component-row">
                        <span className="component-tag">&lt;a&gt;</span>
                        <p><a href="#">A standard hyperlink</a> and <a href="#" target="_blank" rel="noopener">a link
                            opening in
                            a new tab</a>.</p>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;img&gt;</span>
                        <Image src="https://placehold.co/200x120" alt="Placeholder test image" width="200"
                               height="120"/>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;figure&gt; / &lt;figcaption&gt;</span>
                        <figure>
                            <Image src="https://placehold.co/200x120" alt="Figure placeholder image" width="200"
                                   height="120"/>
                            <figcaption>A caption describing the figure above.</figcaption>
                        </figure>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;audio&gt;</span>
                        <audio controls></audio>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;video&gt;</span>
                        <video controls width="250"></video>
                    </div>
                </section>
            </MainContentPanel>

            <MainContentPanel
                title="Tables"
                id="tables"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">

                <section className="test-section">
                    <div className="component-row">
                        <span className="component-tag">&lt;table&gt;</span>
                        <table border={1}>
                            <caption>Sample Data Table</caption>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Alice</td>
                                <td>Engineer</td>
                                <td>Active</td>
                            </tr>
                            <tr>
                                <td>Bob</td>
                                <td>Designer</td>
                                <td>Inactive</td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan={2}>Total</td>
                                <td>2</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </section>
            </MainContentPanel>

            <MainContentPanel
                title="Forms"
                id="forms"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">

                <section className="test-section">

                    <form action="#" onSubmit={(e) => e.preventDefault()}>
                        <fieldset>
                            <legend>Text Inputs</legend>

                            <div className="component-row">
                                <span className="component-tag">&lt;label&gt; + &lt;input type=&#34;text&#34;&gt;</span>
                                <label htmlFor="text-input">Text</label><br/>
                                <input type="text" id="text-input" name="text-input" placeholder="Enter text"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;password&#34;&gt;</span>
                                <label htmlFor="pw-input">Password</label><br/>
                                <input type="password" id="pw-input" name="pw-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;email&#34;&gt;</span>
                                <label htmlFor="email-input">Email</label><br/>
                                <input type="email" id="email-input" name="email-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;search&#34;&gt;</span>
                                <label htmlFor="search-input">Search</label><br/>
                                <input type="search" id="search-input" name="search-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;tel&#34;&gt;</span>
                                <label htmlFor="tel-input">Phone</label><br/>
                                <input type="tel" id="tel-input" name="tel-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;url&#34;&gt;</span>
                                <label htmlFor="url-input">URL</label><br/>
                                <input type="url" id="url-input" name="url-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;number&#34;&gt;</span>
                                <label htmlFor="number-input">Number</label><br/>
                                <input type="number" id="number-input" name="number-input" min="0" max="10"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;textarea&gt;</span>
                                <label htmlFor="textarea-input">Message</label><br/>
                                <textarea id="textarea-input" name="textarea-input" rows={3} cols={3}
                                          placeholder="Multi-line text"></textarea>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Date &amp; Time Inputs</legend>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;date&#34;&gt;</span>
                                <label htmlFor="date-input">Date</label><br/>
                                <input type="date" id="date-input" name="date-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;time&#34;&gt;</span>
                                <label htmlFor="time-input">Time</label><br/>
                                <input type="time" id="time-input" name="time-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;datetime-local&#34;&gt;</span>
                                <label htmlFor="datetime-input">Date &amp; Time</label><br/>
                                <input type="datetime-local" id="datetime-input" name="datetime-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;month&#34;&gt;</span>
                                <label htmlFor="month-input">Month</label><br/>
                                <input type="month" id="month-input" name="month-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;week&#34;&gt;</span>
                                <label htmlFor="week-input">Week</label><br/>
                                <input type="week" id="week-input" name="week-input"/>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Choice Inputs</legend>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;checkbox&#34;&gt;</span>
                                <input type="checkbox" id="chk1" name="chk1"/>
                                <label htmlFor="chk1">Checkbox option one</label><br/>
                                <input type="checkbox" id="chk2" name="chk2" defaultChecked/>
                                <label htmlFor="chk2">Checkbox option two (checked)</label>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;radio&#34;&gt;</span>
                                <input type="radio" id="radio1" name="radio-group" value="a"/>
                                <label htmlFor="radio1">Radio option A</label><br/>
                                <input type="radio" id="radio2" name="radio-group" value="b" defaultChecked/>
                                <label htmlFor="radio2">Radio option B (checked)</label>
                            </div>

                            <div className="component-row">
                        <span
                            className="component-tag">&lt;select&gt; / &lt;option&gt; / &lt;optgroup&gt;</span>
                                <label htmlFor="select-input">Select</label><br/>
                                <select id="select-input" name="select-input">
                                    <optgroup label="Group 1">
                                        <option value="1">Option 1</option>
                                        <option value="2">Option 2</option>
                                    </optgroup>
                                    <optgroup label="Group 2">
                                        <option value="3">Option 3</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;select multiple&gt;</span>
                                <label htmlFor="select-multi">Multi-select</label><br/>
                                <select id="select-multi" name="select-multi" multiple size={3}>
                                    <option value="x">Option X</option>
                                    <option value="y">Option Y</option>
                                    <option value="z">Option Z</option>
                                </select>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input list&gt; + &lt;datalist&gt;</span>
                                <label htmlFor="datalist-input">Datalist</label><br/>
                                <input list="fruit-options" id="datalist-input" name="datalist-input"/>
                                <datalist id="fruit-options">
                                    <option value="Apple"/>
                                    <option value="Banana"/>
                                    <option value="Cherry"/>
                                </datalist>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Range, File &amp; Color</legend>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;range&#34;&gt;</span>
                                <label htmlFor="range-input">Range</label><br/>
                                <input type="range"
                                       id="range-input"
                                       name="range-input"
                                       min="0"
                                       max="100"
                                       value={value}
                                       onChange={(e) => setValue(e.target.value)}/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;file&#34;&gt;</span>
                                <label htmlFor="file-input">File Upload</label><br/>
                                <input type="file" id="file-input" name="file-input"/>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;input type=&#34;color&#34;&gt;</span>
                                <label htmlFor="color-input">Color</label><br/>
                                <input type="color"
                                       id="color-input"
                                       name="color-input"
                                       value="#3366ff"
                                       onChange={(e) => setValue(e.target.value)}/>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Hidden / Disabled / Readonly</legend>
                            <div className="component-row">
                                <span className="component-tag">&lt;input hidden/disabled/readonly&gt;</span>
                                <input type="hidden" name="hidden-field" value="hidden-value"/>
                                <label htmlFor="disabled-input">Disabled input</label><br/>
                                <input type="text" id="disabled-input" value="Can't edit this" disabled/><br/>
                                <label htmlFor="readonly-input">Readonly input</label><br/>
                                <input type="text" id="readonly-input" value="Read only value" readOnly/>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Submit Controls</legend>
                            <div className="component-row">
                                <span className="component-tag">&lt;progress&gt; / &lt;meter&gt;</span>
                                <label htmlFor="progress-el">Progress</label><br/>
                                <progress id="progress-el" value="70" max="100"></progress>
                                <br/>
                                <label htmlFor="meter-el">Meter</label><br/>
                                <meter id="meter-el" value="0.6" min="0" max="1">60%</meter>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;output&gt;</span>
                                <output name="result" htmlFor="range-input">50</output>
                            </div>

                            <div className="component-row">
                                <span className="component-tag">&lt;button type=&#34;submit&#34;&gt;</span>
                                <button type="submit">Submit</button>
                                <button type="reset">Reset</button>
                                <input type="submit" value="Input Submit"/>
                                <input type="button" value="Input Button"/>
                            </div>
                        </fieldset>
                    </form>
                </section>
            </MainContentPanel>

            <MainContentPanel
                title="Buttons & Interactive"
                id="buttons"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">

                <section className="test-section">
                    <div className="component-row">
                        <span className="component-tag">&lt;button&gt;</span>
                        <button type="button">Standard Button</button>
                        <button type="button" disabled>Disabled Button</button>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;details&gt; / &lt;summary&gt;</span>
                        <details>
                            <summary>Click to expand details</summary>
                            <p>Hidden content revealed when the details element is toggled open.</p>
                        </details>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;dialog&gt;</span>
                        <dialog open>
                            <p>This is an open dialog element.</p>
                        </dialog>
                    </div>
                </section>
            </MainContentPanel>

            <MainContentPanel
                title="Semantic / Layout Elements"
                id="semantic"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">

                <section className="test-section">
                    <div className="component-row">
                        <span
                            className="component-tag">&lt;header&gt; / &lt;nav&gt; / &lt;main&gt; / &lt;article&gt; / &lt;section&gt; / &lt;aside&gt; / &lt;footer&gt;</span>
                        <header>
                            <p>This is a nested &lt;header&gt; element (page banner content).</p>
                        </header>
                        <nav>
                            <p>This is a nested &lt;nav&gt; element (navigation links).</p>
                        </nav>
                        <article>
                            <p>This is an &lt;article&gt; element — self-contained composable content.</p>
                        </article>
                        <aside>
                            <p>This is an &lt;aside&gt; element — tangential content.</p>
                        </aside>
                        <footer>
                            <p>This is a nested &lt;footer&gt; element (footer content).</p>
                        </footer>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;div&gt;</span>
                        <div>A generic &lt;div&gt; block container.</div>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;blockquote&gt;</span>
                        <blockquote cite="#">
                            <p>This is a block quotation, typically used for longer quoted passages of text.</p>
                        </blockquote>
                    </div>
                </section>
            </MainContentPanel>

            <MainContentPanel
                title="Embedded & Misc"
                id="embedded"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">

                <section className="test-section">

                    <div className="component-row">
                        <span className="component-tag">&lt;iframe&gt;</span>
                        <iframe srcDoc="&lt;p&gt;Content inside an iframe&lt;/p&gt;" width="300" height="80"
                                title="Test iframe"></iframe>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;canvas&gt;</span>
                        <canvas width="200" height="80"></canvas>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;svg&gt;</span>
                        <svg width="100" height="60" viewBox="0 0 100 60" role="img" aria-label="Test SVG shape">
                            <circle cx="30" cy="30" r="20"/>
                            <rect x="60" y="10" width="35" height="40"/>
                        </svg>
                    </div>
                </section>
            </MainContentPanel>

            <MainContentPanel
                title="Quotes & Code"
                id="quotes-code"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">

                <section className="test-section">
                    <div className="component-row">
                        <span className="component-tag">&lt;q&gt;</span>
                        <p>She said, <q>this is an inline quotation</q>, during the meeting.</p>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;code&gt; / &lt;pre&gt;</span>
                        <p>Inline code example: <code>const x = 42;</code></p>
                        <pre><code>function greet(name)</code></pre>
                    </div>

                    <div className="component-row">
                        <span className="component-tag">&lt;kbd&gt; / &lt;samp&gt; / &lt;var&gt;</span>
                        <p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy. Output: <samp>Process completed</samp>.
                            Variable: <var>x</var> = 10.</p>
                    </div>
                </section>
            </MainContentPanel>
        </div>
    );
}

export default StyleTestPage
