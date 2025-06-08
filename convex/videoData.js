import { v } from 'convex/values';
import { mutation, query } from './_generated/server';


export const CreateVideoData = mutation({
  args:{
    uid: v.id('users'),
    topic: v.string(),
    scriptVariant: v.any()
  },
  handler: async(ctx,args) => {
    const result = await ctx.db.insert('videoData', {
      uid: args.uid,
      topic: args.topic,
      scriptVariant: args.scriptVariant
    });

    return result;
  }
})

export const GetVideoDataById = query({
  args:{
    vid: v.id('videoData')
  },
  handler:async(ctx,args) => {
    const result = await ctx.db.get(args.vid);
    return result;
  }
})

export const updateInitialVideo=mutation({
  args:{
    id: v.id('videoData'),               // Directly pass the document ID from the client
    script: v.optional(v.string()),
    assets: v.optional(v.any()),
    avatar: v.optional(v.any()),
    voice: v.optional(v.any()),
  },
  handler:async(ctx,args) => {
    await ctx.db.patch(args.id, {
      ...(args.script !== undefined && { script: args.script }),
      ...(args.assets !== undefined && { assets: args.assets }),
      ...(args.avatar !== undefined && { avatar: args.avatar }),
      ...(args.voice !== undefined && { voice: args.voice }),
    })
  }
});

export const updateAvatarUrl=mutation({
  args: v.object({
    vId: v.id("videoData"),
    videoUrl: v.any(),
    status: v.number(), 
  }),
  handler:async(ctx,args) => {
    const result = await ctx.db.patch(args.vId,{
      videoUrl: args.videoUrl,
      status: args.status
    });

    return result;
  }
});

export const GetUsersVideo = query({
  args: {
    uId: v.id("users")
  },
  handler: async(ctx,args) => {
    const result = await ctx.db.query('videoData')
      .filter(q => q.eq(q.field('uid'),args.uId))
      .order('desc')
      .collect();
      
    return result;
  }
})