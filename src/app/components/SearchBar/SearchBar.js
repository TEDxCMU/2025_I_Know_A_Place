import { useState } from "react";
import styles from './SearchBar.module.css';

const TAGS = [
    "Exciting", "Melancholic", "Suspenseful", "Stressful", "Enchanting",
    "Nostalgic", "Heartwarming", "Inspirational", "Triumphant", "Mysterious",
    "Ominous", "Funny", "Bittersweet", "Thrilling", "Somber", "Educational"
];

// Function to calculate similarity score
const getSimilarity = (input, tag) => {
    input = input.toLowerCase();
    tag = tag.toLowerCase();

    // Calculate how many characters match in order
    let matchCount = 0;
    for (let i = 0; i < input.length; i++) {
        if (tag[i] === input[i]) matchCount++;
    }

    return matchCount / tag.length; // Normalize by tag length
};

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");
    const [filteredTags, setFilteredTags] = useState([]);

    // Filter and rank tags based on similarity
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value) {
            // Rank tags by similarity and take the top 3
            const matches = TAGS.map(tag => ({
                tag,
                score: getSimilarity(value, tag)
            }))
            .sort((a, b) => b.score - a.score) // Sort descending by score
            .slice(0, 3) // Keep only top 3 matches
            .map(item => item.tag); // Extract tag names

            setFilteredTags(matches);
        } else {
            setFilteredTags([]);
        }
    };

    // Handle selecting a tag
    const handleSelectTag = (tag) => {
        setQuery(tag);  // Set input value to selected tag
        setFilteredTags([]);  // Hide suggestions
        if (onSearch) {
            onSearch(tag);  // Call search function
        }
    };

    return (
        <section className={styles.container}>
            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search by tag..."
                    value={query}
                    onChange={handleInputChange}
                    className={styles.searchInput}
                />
                {filteredTags.length > 0 && (
                    <ul className={styles.suggestions}>
                        {filteredTags.map((tag, index) => (
                            <li key={index} onClick={() => handleSelectTag(tag)}>
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default SearchBar;



