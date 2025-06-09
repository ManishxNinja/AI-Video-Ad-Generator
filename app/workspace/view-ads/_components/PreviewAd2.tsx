import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';

export function AnimatedImage({ src, direction }: {src:any,direction:any}) {

    const frame = useCurrentFrame();



    // Animation progress

    const progress = spring({

        frame,

        fps: 30,

        config: {

            damping: 100,

            stiffness: 200,

        },

    });



    // Different animations based on direction

    const translateX = direction === 'left'

        ? interpolate(progress, [0, 1], [500, 0]) // Slide from right to center

        : direction === 'right'

            ? interpolate(progress, [0, 1], [-500, 0]) // Slide from left to center

            : 0;



    const scale = direction === 'zoom'

        ? interpolate(progress, [0, 1], [1.2, 1]) // Zoom in

        : 1;



    return (

        <img

            src={src}

            alt="Slide"

            style={{

                width: '100%',

                height: '100%',

                objectFit: 'cover',

                transform: `translateX(${translateX}px) scale(${scale})`,

            }}

        />

    );

}



function PreviewAd2({ videoInfo }: { videoInfo: any }) {
  const { durationInFrames } = useVideoConfig();

  const assetLength = videoInfo?.assets?.length || 1;
  const eachImageDuration = Math.floor(durationInFrames / assetLength);
  const directions = ['left','right','zoom']

  return (
    <AbsoluteFill
      style={{
        background: 'white'
      }}
    >
      {/* Top half: Images */}
      <div
        style={{
          height: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {videoInfo?.assets?.map((image: any, index: number) => (
          <Sequence
            key={index}
            from={index * eachImageDuration}
            durationInFrames={eachImageDuration}
          >
            <AnimatedImage src={image} direction={directions[index % directions?.length]} />
          </Sequence>
        ))}
      </div>

      {/* Bottom half: Video (render only if videoUrl exists) */}
      {videoInfo?.videoUrl && (
        <div style={{
          height: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <OffthreadVideo
            src={videoInfo.videoUrl}
            style={{
              width: '0',
              height: '0',
              objectFit: 'cover',
              transform: 'scale(3)',
              transformOrigin: 'center center',
              
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
}

export default PreviewAd2;
