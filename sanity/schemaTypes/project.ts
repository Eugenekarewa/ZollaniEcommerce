import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Portfolio Project',
  type: 'document',
  fields: [
    defineField({ name: 'title',    title: 'Title',    type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug',     title: 'Slug',     type: 'slug',   options: { source: 'title' } }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'client',   title: 'Client',   type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'outcome',  title: 'Key Outcome', type: 'string' }),
    defineField({ name: 'images',   title: 'Project Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'tags',     title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'completedAt', title: 'Completed At', type: 'date' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'client' },
  },
});
