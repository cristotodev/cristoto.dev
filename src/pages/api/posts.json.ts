import { getCollection } from "astro:content";

export async function GET({ request }: { request: Request }) {
    const url = new URL(request.url);
    const searchParam = url.searchParams.get('search')?.trim();

    if (searchParam && searchParam.length > 0) {
        const searchParamsLowerCase = searchParam.toLowerCase();
        const posts = (await getCollection('blog'))
            .filter(post => post.data.title.toLocaleLowerCase().includes(searchParamsLowerCase) || post.data.description.toLocaleLowerCase().includes(searchParamsLowerCase))
            .sort((b, a) => a.data.pubDate - b.data.pubDate);


        return new Response(
            JSON.stringify({
                posts
            })
        );
    }

    const posts = (await getCollection('blog'))
        .sort((b, a) => a.data.pubDate - b.data.pubDate);

    return new Response(
        JSON.stringify({
            posts
        })
    );
}
