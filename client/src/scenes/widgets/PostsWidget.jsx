import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../../state'
import PostWidget from './PostWidget'

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts)
  const token = useSelector((state) => state.token)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = isProfile
          ? await fetch(`http://localhost:3001/posts/${userId}/posts`, {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
            })
          : await fetch('http://localhost:3001/posts', {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
            })
        const data = await response.json()
        if (Array.isArray(data)) {
          dispatch(setPosts({ posts: data }))
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      }
    }

    fetchPosts()
  }, [dispatch, isProfile, userId, token])

  return (
    <>
      {Array.isArray(posts) &&
        posts.map(
          ({
            _id,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
          )
        )}
    </>
  )
}

export default PostsWidget
