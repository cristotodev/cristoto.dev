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
                                    <img className="w-full h-64 object-cover" src={post.data.heroImage} alt={post.data.title} />
                                    <h4 className="title m-0 text-black hover:text-black leading-none p-4">{post.data.title}</h4>
                                    <p className="text-gray-700 text-base text-left pl-4">
                                        {post.data.description.length > 150
                                            ? post.data.description.slice(0, 150) + "..."
                                            : post.data.description}
                                    </p>
                                    <div className="date m-0 text-[#60739F]">
                                        <Time date={post.data.pubDate} />
                                    </div>
                                    {post.data.tags && post.data.tags.length > 0 && (
                                        <div className="px-6 pb-2">
                                            {post.data.tags.map(
                                                ({ name, bgColorHex, fontColorHex }: any, index: number) => (
                                                    <span
                                                        key={index}
                                                        style={{ backgroundColor: bgColorHex, color: fontColorHex }}
                                                        className="inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                                                    >
                                                        {name}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </section>
        </>
    );
}
