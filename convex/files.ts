import { ConvexError, v } from 'convex/values'
import { QueryCtx, MutationCtx,  query, mutation } from './_generated/server'
import { getUser } from './users'
import { fileTypes } from './schema';

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
        if(!identity) throw new ConvexError("Please log in to create a file.")
    return await ctx.storage.generateUploadUrl();
  });

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string){
    const user = await getUser(ctx, tokenIdentifier)

    if (!user) return null

    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)
    return hasAccess;
}

export const moveToTrash = mutation({
    args: {
        fileId: v.id('files'),
    },
    async handler(ctx, args) {
        const file = await ctx.db.get(args.fileId)
        if(!file) throw new ConvexError('File not found.')
        await ctx.db.patch(file._id, {
            inTrash: true,
            isFavorite: false
        })
    },
})

export const restoreFile = mutation({
    args: {
        fileId: v.id('files'),
    },
    async handler(ctx, args) {
        const file = await ctx.db.get(args.fileId);
        if(!file) throw new ConvexError('File not found.')
        await ctx.db.patch(file?._id, {
            inTrash: false
        })
    },
})

export const deleteFile = mutation({
    args: {
        fileId: v.id("files"),
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity) throw new ConvexError("Please log in to create a file.")
        const user = await getUser(ctx, identity.tokenIdentifier)

        if(!identity){
            throw new ConvexError('You must be logged in to delete a file.')
        }

        const file = await ctx.db.get(args.fileId)

        if(!file){
            throw new ConvexError('File not found.')
        }

        const hasAccess = await hasAccessToOrg(ctx, user.tokenIdentifier, file.orgId)

        if(!hasAccess) {
            throw new ConvexError("You are not authorized to delete a file in this organization.")
        }

        await ctx.db.delete(args.fileId)
    },

})

export const createFile = mutation({ 
    args: {
        name: v.string(),
        isFavorite: v.boolean(),
        inTrash: v.boolean(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        type: fileTypes,
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity) throw new ConvexError("Please log in to create a file.")
        const user = await getUser(ctx, identity.tokenIdentifier)

        const hasAccess = await hasAccessToOrg(ctx, user.tokenIdentifier, args.orgId)

        if(!hasAccess) {
            throw new ConvexError("You are not authorized to create a file in this organization.")
        }

        await ctx.db.insert('files', {
            name: args.name,
            isFavorite: args.isFavorite,
            inTrash: args.inTrash,
            orgId: args.orgId,
            fileId: args.fileId,
            type: args.type,
        })
    },
})

export const favFile = mutation({
    args: {
        fileId: v.id("files")
    },
    async handler(ctx, args) {
        const file = await ctx.db.get(args.fileId)
        if(!file) throw new ConvexError('File not found.')
        await ctx.db.patch(file._id, {
            isFavorite: true,
        })
    },
})

export const unFavFile = mutation({
    args: {
        fileId: v.id('files')
    },
    async handler(ctx, args) {
        const file = await ctx.db.get(args.fileId);
        if(!file) throw new ConvexError('File not found.')
        await ctx.db.patch(file?._id, {
            isFavorite: false
        })
    },
})

export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string())
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            return [];
        }
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)
        if(!hasAccess){
            return [];
        }
        const files = await ctx.db.query('files').withIndex('by_orgId', (q) => q.eq("orgId", args.orgId)).collect()

        const query = args.query?.toLowerCase()

        if(query){
            return files.filter((file) => file.name.toLowerCase().includes(query));
        } else {
            return files;
        }

        
    },
})