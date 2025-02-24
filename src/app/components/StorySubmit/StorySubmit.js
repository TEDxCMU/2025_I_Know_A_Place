"use client"

import { useState, useEffect } from "react";

import styles from './StorySubmit.module.css';

async function generate(setLoading, tags, setTags, story) {

    console.log("PROMPT", story); 

    console.log("generate"); 

    setLoading(true); // Set loading state to true

    try {
                       
        const response = await fetch("/api/openai", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: story }),
        });
          
        const event = await response.json();

        setTags(() => event.tags);

        console.log("TAGS:", tags, tags.length);
        
    } catch (error) {x
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
                    <div style={{marginBottom:"12px"}}>
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
                        <label className={styles.label} style={{marginBottom:"12px"}} htmlFor="story">Your Story</label>
                        <textarea
                            className={styles.input}
                            id="story"
                            rows="6"
                            cols="10"
                            disabled = {(tags.length >= 3) ? true : false}
                            value={storyText}
                            onChange={handleStoryText}
                            required
                        />

                        {tags.length < 3 && (
                            <>
                            {tags.length > 0 && (
                                <p className={styles.label} style={{fontWeight:"normal", color:"red", marginBottom:"20px"}}>Please enter an appropriate story</p>
                            )}
                                <button
                                className={styles.submit}
                                type="submit"
                                disabled={loading}
                                onClick = {() => generate(setLoading, tags, setTags, storyText)}
                                >
                                    {!loading ?
                                        <p>Generate Tags</p>
                                    :(
                                        <p>Loading ...</p>
                                    )}
                                </button>
                            </>
                            
                        )}

                        {tags.length >= 3 &&(
                            <>
                            <label className={styles.label} htmlFor="story">Tags</label>
                            <div style={{display:"flex", flexWrap:"wrap", margin:"12px 0 20px 0 "}}>
                            {tags.map((t, index) => (
                                <button className={styles.tag} key={index} value={t}>
                                    {t.tag}
                                </button>
                            ))}
                            </div>
                            <button
                            className={styles.submit}
                            type="submit"
                            disabled={loading}
                            onClick = {() => handleSubmit()}
                            >
                                <p>Submit</p>
                             </button>
                          </>
                        )}
                </>
            )}
            {submitted && (
                <p className={styles.success}>
                Your submission has been successfully received! 
                <br/>
                <br/>
                Please refresh your screen to view it. TEDxCMU reserves the right to remove any submission deemed inappropriate. Thank you!
                </p>
            )}
        </section>
    );
}

export default StorySubmit;
