'use client';

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className='mt-16 prompt_layout'>
            {data.map((post) => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    );
};

const Feed = () => {

    const [posts, setPosts] = useState([]);

    // Search states
    const [searchText, setSearchText] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchedResults, setSearchedResults] = useState([]);

    const filteredPrompts = (searchtext) =>  {
        const regex = new RegExp(searchtext, 'i');

        return posts.filter(post => regex.test(post.creator.username) || 
                                        regex.test(post.tag) || 
                                        regex.test(post.prompt));
    };

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        // debounce method
        setSearchTimeout(
        setTimeout(() => {
            const searchResult = filteredPrompts(e.target.value);
            setSearchedResults(searchResult);
        }, 500)
        );
    };

    const handleTagClick = (tagName) => {
        setSearchText(tagName);

        const searchResult = filteredPrompts(tagName);
        setSearchedResults(searchResult);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('/api/prompt');
            const data = await response.json();

            setPosts(data);
        };

        fetchPosts();
    }, []);

    return (
        <section className='feed'>
            <form className='relative w-full flex-center'>
                <input
                    type='text'
                    placeholder='Search for a tag or a username'
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className='search_input peer'
                />
            </form>

            {/* All Prompts */}
            {searchText ? (
                <PromptCardList
                    data={searchedResults}
                    handleSearchChange={handleSearchChange}
                />
            ) : (
                <>
                    <PromptCardList data={posts} handleTagClick={handleTagClick} />
                </>
            )}
        </section>
    )
}

export default Feed