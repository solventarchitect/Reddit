import Feed from '@/components/Feed'
import PostBox from '@/components/PostBox'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '@/components/Header/Header'
import { useQuery } from '@apollo/client'
import { GET_SUBREDDIT_WITH_LIMIT } from 'graphql/queries'
import SubredditRow from '@/components/SubredditRow'

const HomePage: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDIT_WITH_LIMIT, {
    variables: {
      limit: 10,
    }
  })

  const subreddits: Subreddit[] = data?.getSubredditListLimit

  return (
    <div className="my-7 mx-auto max-w-5xl">
      <Head>
        <title>Reddit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* POST BOX */}
      <PostBox />

      {/* FEED */}
      <div className="flex-1 lg:flex">
        <Feed />
        <div className="sticky top-36 mx-5 mt-0 hidden h-fit min-w-[420px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top Communities</p>
          <div>
            {/* LIST SUBREDDITS */}
            {subreddits?.map((subreddit, i) => (
              <SubredditRow key={subreddit.id} topic={subreddit.topic} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
