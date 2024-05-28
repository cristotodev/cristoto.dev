import { useEffect, useState } from "react";
import { Time } from "./Time";

interface Props {
    initialPosts: any[];
}

export function Posts({ initialPosts }: Props) {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState<any[]>(initialPosts);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/posts.json?search=${encodeURIComponent(query)}`);
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                setPosts(initialPosts);
            }
        };

        if (query && query.trim() !== "") {
            fetchPosts();
        } else {
            setPosts(initialPosts);
        }
    }, [query, initialPosts]);

    return (
        <>
            <div className="flex justify-center items-center p-6 bg-white shadow-md rounded-lg mb-8">
                <input onChange={e => setQuery(e.target.value)} type="search" placeholder="Buscar..." className="w-full px-5 py-3 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500" />
            </div>
            <section className="flex flex-wrap justify-start">
                <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                    {
                        posts.map((post, index) => (
                            <li key={index} className="hover:shadow-2xl shadow-lg transition-shadow duration-300 ease-in-out rounded-xl">
                                <a href={`/blog/${post.slug}/`}>
                                    <img width={720} height={360} src={post.data.heroImage} alt={post.data.title} />
                                    <h4 className="title m-0 text-black hover:text-black leading-none p-4">{post.data.title}</h4>
                                    <div className="date m-0 text-[#60739F]">
                                        <Time date={post.data.pubDate} />
                                    </div>
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </section>
        </>
    );
}
