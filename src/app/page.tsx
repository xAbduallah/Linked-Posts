'use client'
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./(Global)/CreatePost";
import LatestPosts from "./(Global)/LatestPosts";

export default function Home() {

  const dispatch = useDispatch();

  return (
    <section className="flex flex-col items-center justify-start">
      <CreatePost />
      <LatestPosts />
    </section>
  );
}
