"use client";
import React, { createRef, useEffect, useRef, useState } from "react";
import {
  TAnimeInfoEpisode,
  TAnimeInfo,
  TWatchedAnime,
} from "@/@types/AnimeType";
import EpisodeDisplay from "../components/EpisodeDisplay";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";

type EpisodeLayoutProps = {
  animeInfo: TAnimeInfo;
  episode: TAnimeInfoEpisode;
};

function EpisodeLayout({ animeInfo, episode }: EpisodeLayoutProps) {
  const router = useRouter();
  const { setKitsuneWatched, getKitsuneWatchedId } = useLocalStorage();
  const curRef = useRef<null | HTMLDivElement>(null);
  const [watched, setWatched] = useState<TWatchedAnime | null>(null);
  let refs = animeInfo.episodes.reverse().reduce((acc: any, value) => {
    acc[value.number] = createRef();
    return acc;
  }, {});

  useEffect(() => {
    setWatched(getKitsuneWatchedId(animeInfo.id));
    setKitsuneWatched({
      id: animeInfo.id,
      title: animeInfo.title,
      image: animeInfo.image,
      ep: {
        id: episode.id,
        number: episode.number,
      },
    });
  }, []);

  const onSearch = (e: any) => {
    e.preventDefault();
    let ep = Number(e.target.value);
    if (ep <= 0) return;
    if (!refs[ep]) return;
    curRef.current = refs[ep].current;
    if (curRef.current) {
      curRef.current.scrollIntoView();
    }
  };

  return (
    <div className="flex flex-col gap-5 mb-10 mt-10 ml-3 mr-3 lg:ml-0 lg:mr-0 lg:m-10 lg:mb-5 ">
      <div className="flex items-center gap-10">
        <p className="text-2xl uppercase font-bold">Episodes</p>
        <input
          type="text"
          className="input input-sm"
          placeholder="Search"
          onChange={onSearch}
        />
      </div>
      <div className="flex flex-wrap gap-5 h-[600px] max-h-[90vh] overflow-y-auto">
        {animeInfo.episodes.map((ep: TAnimeInfoEpisode, index: number) => (
          <div
            onClick={() =>
              router.push(`/anime/${animeInfo.id}/watch?ep=${ep.id}`)
            }
            key={index}
            className={"w-full lg:w-[320px]"}
            ref={refs[ep.number]}
          >
            <EpisodeDisplay
              ep={ep}
              backSrc={animeInfo.image}
              isCurrent={episode.id === ep.id}
              watched={
                watched
                  ? watched.ep.some(
                    (e: { id: string; number: number }) => e.id === ep.id
                  )
                  : false
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EpisodeLayout;