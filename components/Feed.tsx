import React from 'react'
import { useQuery } from '@apollo/client'
// import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
// import client from '@/lib/apollo-client'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from 'graphql/queries'
import Post from './Post';

type Props = {
    topic?: string
  }

function Feed({topic}: Props) {
    const {data, error} = !topic ? useQuery(GET_ALL_POSTS) : useQuery(GET_ALL_POSTS_BY_TOPIC, {
        variables: {
            topic: topic
        }
    })

    const posts: Reddit_post[] = !topic ? data?.getPostList : data?.getPostListByTopic

  return (
    <div>
        {posts?.map((post) => (
            <Post key={post.id} post={post} />
        ))}
    </div>
  )
}

export default Feed