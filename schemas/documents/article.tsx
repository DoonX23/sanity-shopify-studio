// schemas/article.ts
import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {validateSlug} from '../../utils/validateSlug'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: BookIcon,
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
        // Slug
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: validateSlug,
    }),
    // Excerpt
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: '文章摘要或简短描述',
    }),

    // Parent Article Reference
    defineField({
      name: 'parentArticle',
      title: 'Parent Article',
      type: 'reference',
      to: [{type: 'article'}],
      description: '选择父级文章，如果没有则为顶级文章',
    }),
    
    // Full Path
    defineField({
      name: 'fullPath',
      title: 'Full Path',
      type: 'string',
      description: '完整路径，基于父级路径和当前slug自动生成',
      readOnly: true, // 设置为只读，由系统自动计算
    }),
        // Image - 添加的新字段
    defineField({
      name: 'image',
      title: 'Image',
      type: 'object',
      fields: [
        defineField({
          name: 'url',
          title: 'URL',
          type: 'url',
        }),
        defineField({
          name: 'height',
          title: 'Height',
          type: 'number',
        }),
        defineField({
          name: 'width',
          title: 'Width',
          type: 'number',
        }),
      ],
      description: '文章主图',
    }),
    // Breadcrumb - 存储面包屑导航数据
    defineField({
      name: 'breadcrumb',
      title: 'Breadcrumb',
      type: 'array',
      description: '面包屑导航数据，自动生成，包含从首页到当前页面的导航路径',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'path',
              title: 'Path',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    // Page Builder
    defineField({
      name: 'pagebuilder',
      title: 'Page Builder',
      type: 'array',
      description: '使用不同的内容块构建页面',
      of: [
        // 新增的图文分栏区块
        {
          type: 'object',
          name: 'splitSection',
          title: 'Split Section',
          description: '左右分栏的图文布局，可用于产品或服务展示',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'object',
              fields: [
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                }),
                defineField({
                  name: 'altText',
                  title: 'Alt Text',
                  type: 'string',
                }),
                defineField({
                  name: 'height',
                  title: 'Height',
                  type: 'number',
                }),
                defineField({
                  name: 'width',
                  title: 'Width',
                  type: 'number',
                }),
              ],
            }),
            defineField({
              name: 'cta',
              title: 'Call to Action Tag',
              type: 'string',
              description: '顶部的号召标签文本',
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'byline',
              title: 'Byline',
              type: 'text',
              description: '主要描述文本',
            }),
            // 新增: 列表字段
            defineField({
              name: 'list',
              title: 'List Items',
              type: 'array',
              description: '列表项目，用于展示要点或特性',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Text',
                      type: 'string',
                      description: '列表项文本',
                    }),
                    defineField({
                      name: 'highlighted',
                      title: 'Highlight',
                      type: 'boolean',
                      description: '是否高亮显示此项',
                      initialValue: false,
                    }),
                  ],
                },
              ],
            }), 
            defineField({
              name: 'buttonText',
              title: 'Primary Button Text',
              type: 'string',
              description: '主按钮文本',
            }),
            defineField({
              name: 'buttonLink',
              title: 'Button Link',
              type: 'string',
              description: '按钮链接',
            }),
            defineField({
              name: 'secondaryButtonText',
              title: 'Secondary Button Text',
              type: 'string',
              description: '次要按钮文本',
            }),
            defineField({
              name: 'secondaryButtonLink',
              title: 'Secondary Button Link',
              type: 'string',
              description: '次要按钮的链接',
            }),
            defineField({
              name: 'imageOnRight',
              title: 'Image on Right',
              type: 'boolean',
              description: '选择图片是在右侧还是左侧',
              initialValue: false,
            }),
          ],
        },
        // 图片横栏区块
        {
          type: 'object',
          name: 'imageSliderSection',
          title: 'Image Slider Section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: '标题',
            }),
            defineField({
              name: 'subheading',
              title: 'Subheading',
              type: 'string',
              description: '副标题',
            }),
            defineField({
              name: 'items',
              title: 'Slider Items',
              type: 'array',
              description: '滑块中的图片项',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'image',
                      title: 'Image',
                      type: 'object',
                      fields: [
                        defineField({
                          name: 'url',
                          title: 'URL',
                          type: 'url',
                        }),
                        defineField({
                          name: 'altText',
                          title: 'Alt Text',
                          type: 'string',
                        }),
                      ],
                    }),
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      description: '图片描述文本',
                    }),
                    // 新增: 列表字段
                    defineField({
                      name: 'list',
                      title: 'List Items',
                      type: 'array',
                      description: '列表项目，用于展示要点或特性',
                      of: [
                        {
                          type: 'object',
                          fields: [
                            defineField({
                              name: 'text',
                              title: 'Text',
                              type: 'string',
                              description: '列表项文本',
                            }),
                            defineField({
                              name: 'highlighted',
                              title: 'Highlight',
                              type: 'boolean',
                              description: '是否高亮显示此项',
                              initialValue: false,
                            }),
                          ],
                        },
                      ],
                    }), // 新增列表字段结束
                    defineField({
                      name: 'link',
                      title: 'Link',
                      type: 'string',
                      description: '图片链接URL',
                    }),
                  ],
                },
              ],
            }),
          ],
        },
        // Hero区块
        {
          type: 'object',
          name: 'heroSection',
          title: 'Hero Section',
          fields: [
            defineField({
              name: 'tagline',
              title: 'Tagline',
              type: 'string',
              description: '顶部小标签文本',
            }),
            defineField({
              name: 'taglineLink',
              title: 'Tagline Link',
              type: 'string',
              description: '小标签链接',
            }),
            defineField({
              name: 'taglineLinkText',
              title: 'Tagline Link Text',
              type: 'string',
              description: '小标签链接文本',
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
            // 新增: 列表字段
            defineField({
              name: 'list',
              title: 'List Items',
              type: 'array',
              description: '列表项目，用于展示要点或特性',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Text',
                      type: 'string',
                      description: '列表项文本',
                    }),
                    defineField({
                      name: 'highlighted',
                      title: 'Highlight',
                      type: 'boolean',
                      description: '是否高亮显示此项',
                      initialValue: false,
                    }),
                  ],
                },
              ],
            }), // 新增列表字段结束
          ],
        },
        // 数字统计区块
        {
          type: 'object',
          name: 'statsSection',
          title: 'Stats Section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'subheading',
              title: 'Subheading',
              type: 'string',
            }),
            defineField({
              name: 'stats',
              title: 'Stats',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Name',
                      type: 'string',
                    }),
                    defineField({
                      name: 'value',
                      title: 'Value',
                      type: 'string',
                    }),
                  ],
                },
              ],
            }),
          ],
        },
        {
          name: 'cardGridSection',
          title: 'Card Grid Section',
          type: 'object',
          description: '灵活的卡片网格布局，支持多种布局样式',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading', 
              type: 'string',
              description: '区块标题',
            }),
            defineField({
              name: 'subheading',
              title: 'Subheading',
              type: 'string',
              description: '区块副标题',
            }),
            defineField({
              name: 'cardLayout',
              title: 'Card Layout',
              type: 'string',
              description: '选择卡片的内容布局样式',
              options: {
                list: [
                  { title: '左图右内容', value: 'imageLeft' },
                  { title: '上图下内容', value: 'imageTop' },
                ],
              },
              initialValue: 'imageLeft',
            }),
            defineField({
              name: 'columns',
              title: 'Columns',
              type: 'number',
              description: '设置卡片的列数 (布局支持1-6列)',
              validation: (Rule) => Rule.min(1).max(6),
              initialValue: 2,
            }),
            defineField({
              name: 'cards',
              title: 'Cards',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                      description: '卡片标题',
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      description: '卡片详细描述',
                    }),
                    defineField({
                      name: 'list',
                      title: 'List Items',
                      type: 'array',
                      description: '列表项目，用于展示要点或特性',
                      of: [
                        {
                          type: 'object',
                          fields: [
                            defineField({
                              name: 'text',
                              title: 'Text',
                              type: 'string',
                              description: '列表项文本',
                            }),
                            defineField({
                              name: 'highlighted',
                              title: 'Highlight',
                              type: 'boolean',
                              description: '是否高亮显示此项',
                              initialValue: false,
                            }),
                          ],
                        },
                      ],
                    }),
                    defineField({
                      name: 'image',
                      title: 'Image',
                      type: 'object',
                      fields: [
                        defineField({
                          name: 'url',
                          title: 'URL',
                          type: 'url',
                          description: '图片URL',
                        }),
                        defineField({
                          name: 'alt',
                          title: 'Alt Text',
                          type: 'string',
                          description: '图片替代文本',
                        }),
                      ],
                    }),
                    defineField({
                      name: 'href',
                      title: 'Link',
                      type: 'string',
                      description: '卡片链接URL',
                    }),
                    defineField({
                      name: 'readMore',
                      title: 'Read More Text',
                      type: 'string',
                      description: '阅读更多链接文本，默认为"Learn more"',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      media: 'image',
                    },
                    prepare({ title, media }) {
                      return {
                        title: title || 'Card without title',
                        media: media?.url ? { url: media.url } : null,
                      };
                    },
                  },
                },
              ],
            }),
            defineField({
              name: 'sectionStyles',
              title: 'Section Styles',
              type: 'object',
              description: '区块整体样式设置（使用 Tailwind CSS 类名）',
              fields: [
                defineField({
                  name: 'section',
                  title: 'Section Styles',
                  type: 'string',
                  description: '区块样式，包括背景、间距等 (例如: bg-white py-12 md:py-16, bg-gradient-to-br from-blue-50 to-white py-8 px-4)',
                  placeholder: 'bg-white py-12 md:py-16',
                }),
                defineField({
                  name: 'container',
                  title: 'Container Styles',
                  type: 'string',
                  description: '容器样式 (例如: container mx-auto px-4 max-w-7xl)',
                  placeholder: 'container mx-auto px-4',
                }),
                defineField({
                  name: 'headerWrapper',
                  title: 'Header Wrapper Styles',
                  type: 'string',
                  description: '标题区域样式 (例如: mb-8 md:mb-12 text-center)',
                  placeholder: 'mb-8 md:mb-12 text-center',
                }),
                defineField({
                  name: 'heading',
                  title: 'Heading Styles',
                  type: 'string',
                  description: '主标题样式 (例如: text-3xl md:text-4xl font-bold text-gray-900)',
                  placeholder: 'text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900',
                }),
                defineField({
                  name: 'subheading',
                  title: 'Subheading Styles',
                  type: 'string',
                  description: '副标题样式 (例如: text-lg text-gray-600 max-w-3xl mx-auto)',
                  placeholder: 'text-lg/8 text-gray-600 max-w-3xl mx-auto',
                }),
              ],
            }),
            defineField({
              name: 'cardStyles',
              title: 'Card Styles',
              type: 'object',
              description: '卡片内容的样式设置（使用 Tailwind CSS 类名）',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title Styles',
                  type: 'string',
                  description: '标题样式 (例如: text-2xl font-bold text-blue-900)',
                  placeholder: 'text-xl font-semibold',
                }),
                defineField({
                  name: 'description',
                  title: 'Description Styles',
                  type: 'string',
                  description: '描述样式 (例如: text-lg text-blue-600 leading-relaxed)',
                  placeholder: 'text-base text-gray-600',
                }),
                defineField({
                  name: 'readMore',
                  title: 'Read More Styles',
                  type: 'string',
                  description: '"阅读更多"链接样式 (例如: text-lg font-bold text-purple-600 underline)',
                  placeholder: 'text-highlight font-bold',
                }),
                defineField({
                  name: 'card',
                  title: 'Card Container Styles',
                  type: 'string',
                  description: '卡片容器样式 (例如: bg-gradient-to-br from-blue-50 to-white border shadow-lg)',
                  placeholder: 'bg-gray-100',
                }),
                defineField({
                  name: 'cardContent',
                  title: 'Card Content Styles',
                  type: 'string',
                  description: '卡片内容区域样式 (例如: p-6 space-y-4)',
                  placeholder: 'p-3 sm:p-4',
                }),
                defineField({
                  name: 'image',
                  title: 'Image Styles',
                  type: 'string',
                  description: '图片样式 (例如: rounded-lg shadow-md border-2)',
                  placeholder: 'w-full h-full object-cover',
                }),
                defineField({
                  name: 'imageAspect',
                  title: 'Image Aspect Ratio',
                  type: 'string',
                  description: '图片宽高比 (例如: aspect-[4/3], aspect-square, aspect-[16/9], aspect-[3/2], aspect-[2/1])',
                  placeholder: 'aspect-[4/3]',
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'subheading',
              layout: 'cardLayout',
            },
            prepare({ title, subtitle, layout }) {
              return {
                title: title || 'Card Grid Section',
                subtitle: `${layout === 'imageTop' ? '卡片布局: 上图下内容' : '卡片布局: 左图右内容'} | ${subtitle || ''}`,
              };
            },
          },
        }
      ],
    }),
    // Published At
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: '文章发布日期和时间',
      initialValue: () => new Date().toISOString(),
    }),
    
    // Related Collections
    defineField({
      name: 'relativeCollections',
      title: 'Related Collections',
      type: 'array',
      description: '与此文章相关的Shopify产品集合',
      of: [
        {
          type: 'reference',
          to: [{type: 'collection'}],
        },
      ],
    }),
    
    // Body
    defineField({
      name: 'body',
      title: 'Body',
  type: 'array',  // 基本类型是数组
  of: [  // 在这里定义数组包含的元素类型
    {
      type: 'block',
      // 块级编辑器选项...
    },
    {
      type: 'image',
      // 图片选项...
    }
    // 其他可能的类型...
  ]
    }),
    
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
    }),
  ],
  preview: {
    select: {
      active: 'active',
      seoImage: 'seo.image',
      title: 'title',
      fullPath: 'fullPath',
    },
    prepare(selection) {
      const {seoImage, title, fullPath} = selection

      return {
        media: seoImage,
        title,
        subtitle: fullPath,
      }
    },
  },
})