import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { homePostList } from '../../API/Post/PostAPI';
import PostList from '../../Components/Post/PostList';
import styled from 'styled-components';
import HomeSearch from './HomeSearch';
import Header from '../../Components/Common/Header';
import Footer from '../../Components/Common/Footer';
import { Container } from '../../Components/Common/Container';
import postsAtom from '../../Recoil/postsAtom';

export default function Home() {
  const limit = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [ref, inView] = useInView();
  const [skip, setSkip] = useState(0);
  const setPostData = useSetRecoilState(postsAtom);

  // const getHomePostList = homePostList(limit, skip);

  useEffect(()=>{
    const getPostData = async () => {
      try {
        const res = await homePostList(limit, skip);
        const postList = res.posts;
        if(postList.length>0){
          console.log(postList);
          await setPostData((prev)=>([...prev, ...postList]));
          console.log(postData)
        }
        setIsLoading(true);
      } catch (error) {
      // setTimeout(() => {
        setIsLoading(true);
    //   }, 1200);
    }
  }
    getPostData();
},[skip])

  const postData = useRecoilValue(postsAtom);
    console.log(postData);

  useEffect(()=>{
    if(inView && isLoading){
    console.log(postData);
      setSkip((prev) => prev + limit);
    }
  },[inView, isLoading]);

  return (
    <Container>
      <Header type='home' />
      <HomeWrap>
        { postData && Object.keys(postData).length !== 0 ? (
          <HomeContainer>
            <PostBg>
              {postData.map((item) => (
                <PostList key={item.id} post={item} isLoading={isLoading}/>
              ))}
            </PostBg>
          </HomeContainer>
        ) : (
          <HomeContainer>
            <HomeSearch />
          </HomeContainer>
        )}
      <div ref={ref} />
      </HomeWrap>
      <Footer />
    </Container>
  );
}

const HomeWrap = styled.div`
  background-color: #fff;
  margin-top: 35px;
  margin-bottom: 60px;
  flex: 1;
  // height: 100%;
`;
const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff9e4;
`;
const PostBg = styled.div`
  max-width: 39rem;
  height: 100%;
  margin: auto;
  background-color: #fff;
`;
