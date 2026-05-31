import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name',    title: 'Client Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role',    title: 'Role',        type: 'string' }),
    defineField({ name: 'company', title: 'Company',     type: 'string' }),
    defineField({ name: 'quote',   title: 'Quote',       type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'rating',  title: 'Rating (1–5)', type: 'number', validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'avatar',  title: 'Photo',       type: 'image', options: { hotspot: true } }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'company' },
  },
});
