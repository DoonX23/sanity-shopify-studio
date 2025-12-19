import {defineConfig, isDev} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {structure} from './desk'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {customDocumentActions} from './plugins/customDocumentActions'

import {UpdateFullPathAction} from './actions/updateFullPathAction' // 注释掉

const devOnlyPlugins = [visionTool()]

export default defineConfig({
  name: 'default',
  title: 'Sanity + Shopify demo',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'nmemjmqq',
  dataset: process.env.SANITY_STUDIO_PROJECT_DATASET || 'production',
  plugins: [
    deskTool({structure}),
    colorInput(),
    imageHotspotArrayPlugin(),
    customDocumentActions(),
    media(),
    ...(isDev ? devOnlyPlugins : []),
  ],
 // document: { // 注释掉整个 document 配置
   // actions: (prev, context) => {
  //    if (context.schemaType === 'article') {
  //      return [UpdateFullPathAction, ...prev]
   //   }
   //   return prev
  // },
  // },
  schema: {
    types: schemaTypes,
  },
  form: {
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource !== mediaAssetSource)
      },
    },
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource === mediaAssetSource)
      },
    },
  },
})