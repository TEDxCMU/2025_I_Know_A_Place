"use client"

import { useState, useEffect } from "react";

import styles from './StorySubmit.module.css';
import OpenAI from 'openai';

async function generate(setLoading, setTags, story) {

    console.log(prompt); 

    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI,
        dangerouslyAllowBrowser: true
    });

    console.log("generate"); 

    setLoading(true); // Set loading state to true

    try {
        
      //Prompting
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: 'system',
                content: 
                `
                Generate five tags associated with the story provided. 
                These tags should describe the tone, themes, and emotions of a story. 
                Here is an example: 
                {
                    "tags": [
                    { "tag": "Miracle"},
                    { "tag": "Love"},
                    { "tag": "School" }
                    { "tag": "Magical" }
                    { "tag": "Triumphant" }
                    ],
                }

                If the story provided is inappropriate, return an array of length 1: 
                {
                    "tags": [
                        {"tag": ""}
                    ]
                }

                Do not put a comma at the end of the events or connections arrays. 
                Return the response in JSON format that can be parsed by JSON.parse().
                `
            },
            {
                role: 'user',
                content: 
                `
                ${story}
                `
            }
        ]
    });
                       
        let event = response.choices[0].message.content;

        let startIndex = event.indexOf('{');
        let endIndex = event.lastIndexOf('}');
        event = event.substring(startIndex, endIndex + 1);

        //Parsing through returned JSON File
        const parsedEventsObject = JSON.parse(event);
        console.log(parsedEventsObject.tags); 

        setTags(parsedEventsObject.tags);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        console.log("done");
        setLoading(false); // Set loading state to false once processing is done
    }
}

function StorySubmit({ latLong }) {
    const [name, setName] = useState('');
    const [storyText, setStoryText] = useState('');
    const [submitted, setSubmitted] = useState('');
    const [selected, setSelected] = useState('What’s the strongest memory you have of this place?'); 
    const [loading, setLoading] = useState(false); 
    const [tags, setTags] = useState([]); 


    useEffect(() => {
        (async function () {
            const allPrompts = []
            // const response = await allPrompts.get();
            // const newPrompts = [];
            // response.docs.forEach((doc) => {
            //     const data = doc.data();
            //     newPrompts.push(data.text);
            // });
            // setPrompt(newPrompts[0]);
            // setPrompts(newPrompts);
        })();
    }, []);

    const handleName = (event) => {
        setName(event.target.value);
    };


    const handlePrompt = (event) => {
        setSelected(event.target.value);
    };

    const handleStoryText = (event) => {
        setStoryText(event.target.value);
    };

    async function handleSubmit(event) {

        try {

            const data = {
                name: name, 
                selected: selected, 
                storyText: storyText, 
                tags: tags,
                latLong: latLong
            }

            const response = await fetch("/api/write", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
    
            const result = await response.json();

            if (result.success) {
                console.log("Data successfully added to Google Sheets!");
            } else {
                console.error("Error:", result.message);
            }
        } catch (error) {
            console.error("Failed to submit data:", error);
        }

        setSubmitted(true);
    };

    const prompt = [
        { id: 1, value: "What’s the strongest memory you have of this place?" },
        { id: 2, value: "Do you think of this place differently now than you did in the past?" },
        { id: 3, value: "If you could revisit this place exactly as it was in one moment, when would that be?" },
        { id: 4, value: "If you close your eyes and picture this place, what do you smell and taste first?" }
    ];

    return (
        <section>
            {!submitted && (
                <>
                    <div style={{marginBottom:"10px"}}>
                        <h1 className={styles.title}>Share Your Story:</h1>
                        <label className={styles.label} style={{fontWeight:"normal", marginTop:"4px"}}>
                                Start your story at location: {latLong.lat.toFixed(4)}, {latLong.lng.toFixed(4)}
                        </label>
                    </div>
                        <label className={styles.label} htmlFor="name">Name </label>
                        <input
                            className={styles.input}
                            id="name"
                            type="text"
                            onChange={handleName}
                            value={name}
                        />
                        <label className={styles.label} htmlFor="prompt">Choose a prompt:</label>
                        <select className={styles.input} id="prompt" value={selected} onChange={handlePrompt}>
                            {prompt.map((text, index) => (
                                <option key={index} value={text.value}>
                                    {text.value}
                                </option>
                            ))}
                        </select>
                        <label className={styles.label} style={{marginBottom:"10px"}} htmlFor="story">Your Story</label>
                        <textarea
                            className={styles.input}
                            id="story"
                            rows="6"
                            cols="10"
                            disabled = {(tags.length >= 5) ? true : false}
                            value={storyText}
                            onChange={handleStoryText}
                            required
                        />

                        {tags.length < 5 && (
                            <>
                            {tags.length > 0 && (
                                <p className={styles.label} style={{fontWeight:"normal", color:"red", marginBottom:"20px"}}>Please enter an appropriate story</p>
                            )}
                                <button
                                className={styles.submit}
                                type="submit"
                                disabled={!(storyText)}
                                onClick = {() => generate(setLoading, setTags, storyText)}
                                >
                                    {!loading ?
                                        <p>Generate Tags</p>
                                    :(
                                        <p>Loading ...</p>
                                    )}
                                </button>
                            </>
                            
                        )}

                        {tags.length >= 5 &&(
                            <>
                            <label className={styles.label} htmlFor="story">Edit Tags</label>
                            <label className={styles.label} style={{fontWeight:"normal", marginTop:"4px"}}>
                                Click to remove tags
                            </label>
                            <div style={{display:"flex", flexWrap:"wrap", margin:"10px 0 20px 0 "}}>
                            {tags.map((t, index) => (
                                <button className={styles.tag} key={index} value={t}>
                                    {t.tag}
                                </button>
                            ))}
                            </div>
                            <button
                            className={styles.submit}
                            type="submit"
                            disabled={!(storyText)}
                            onClick = {() => handleSubmit()}
                            >
                                <p>Submit</p>
                             </button>
                          </>
                        )}
                </>
            )}
            {submitted && (
                <p className={styles.success}>Submitted successfully! You will recieve an email when our team reviews and publishes your story. Thank you!</p>
            )}
        </section>
    );
}

export default StorySubmit;
