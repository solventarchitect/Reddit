type Comments = {
    id: number,
    comment: string,
    created_at: string,
    post_id: number,
    title: string,
    updated_at: string,
    user_id: number,
    username: string
}

type Vote = {
    created_at: string,
    id: number,
    post_id: number,
    upvote: boolean,
    username: string
}

type Subreddit = {
    created_at: string,
    id: number,
    topic: string
}

type Post = {
    id: number,
    user_id: number,
    title: string,
    content: string,
    link: string,
    image: string,
    video: string,
    subreddit_id: number,
    username: string,
    created_at: string,
    updated_at: string,
    comments: Comments[],
    votes: Vote[],
    subreddit: Subreddit[]
}