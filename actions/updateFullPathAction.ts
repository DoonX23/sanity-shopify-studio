// actions/updateFullPathAction.ts
import {useEffect, useState} from 'react'
import {useClient, useDocumentOperation} from 'sanity'

export function UpdateFullPathAction(props) {
  const {id, type, draft, published} = props
  const [isUpdating, setIsUpdating] = useState(false)
  const doc = draft || published
  const {patch, publish} = useDocumentOperation(id, type)
  const client = useClient({apiVersion: '2023-03-15'})

  // 仅处理article类型的文档
  if (type !== 'article') {
    return null
  }

  // 生成面包屑导航数据和fullPath
  const generatePathAndBreadcrumb = async () => {
    // 如果当前文档没有父文档，则它是顶级文档
    if (!doc.parentArticle || !doc.parentArticle._ref) {
      const path = doc.slug?.current || '';
      // 对顶级文档，breadcrumb只包含自身
      return {
        fullPath: path,
        breadcrumb: [
          {
            _key: path, // 使用路径作为key
            title: doc.title,
            path: path,
          },
        ],
      }
    }

    // 对于子文档，需要获取父文档信息来生成breadcrumb
    const parentDoc = await client.getDocument(doc.parentArticle._ref)
    if (parentDoc) {
      // 计算fullPath
      const fullPath = `${parentDoc.fullPath}/${doc.slug?.current || ''}`
      
      // 构建breadcrumb，继承父文档的breadcrumb并添加当前文档
      let breadcrumb = []
      
      // 如果父文档已有breadcrumb，继承它
      if (parentDoc.breadcrumb && Array.isArray(parentDoc.breadcrumb)) {
        // 保持原来项目的_key，复制整个项目
        breadcrumb = [...parentDoc.breadcrumb]
      } else if (parentDoc.title && parentDoc.fullPath) {
        // 如果父文档没有breadcrumb（可能是旧数据），创建一个简单的
        breadcrumb = [{
          _key: parentDoc.fullPath, // 使用路径作为key
          title: parentDoc.title,
          path: parentDoc.fullPath,
        }]
      }
      
      // 添加当前文档到breadcrumb
      breadcrumb.push({
        _key: fullPath, // 使用路径作为key
        title: doc.title,
        path: fullPath,
      })
      
      return {
        fullPath,
        breadcrumb,
      }
    }
    
    // 如果找不到父文档，则作为顶级文档处理
    const defaultPath = doc.slug?.current || '';
    return {
      fullPath: defaultPath,
      breadcrumb: [
        {
          _key: defaultPath, // 使用路径作为key
          title: doc.title,
          path: defaultPath,
        },
      ],
    }
  }

  // 递归更新子文档的路径和面包屑
  const updateChildDocs = async (parentId) => {
    // 查找所有引用了此文档作为父文档的文档
    const childDocs = await client.fetch(
      `*[_type == "article" && parentArticle._ref == $parentId]`,
      {parentId}
    )

    // 为每个子文档更新fullPath和breadcrumb
    for (const childDoc of childDocs) {
      // 重新获取父文档（即刚刚被更新的文档）
      const updatedParent = await client.getDocument(parentId)
      
      // 计算子文档的fullPath
      const childFullPath = `${updatedParent.fullPath}/${childDoc.slug?.current || ''}`
      
      // 构建子文档的breadcrumb
      const childBreadcrumb = [
        // 复制父文档的所有breadcrumb项目（保持原来的_key）
        ...(updatedParent.breadcrumb || []),
        // 添加当前子文档
        {
          _key: childFullPath, // 使用路径作为key
          title: childDoc.title,
          path: childFullPath,
        }
      ]
      
      // 更新子文档
      await client
        .patch(childDoc._id)
        .set({
          fullPath: childFullPath,
          breadcrumb: childBreadcrumb,
        })
        .commit()
      
      // 递归更新该子文档的子文档
      await updateChildDocs(childDoc._id)
    }
  }

  const handleSaveAndUpdatePaths = async () => {
    setIsUpdating(true)

    try {
      // 生成路径和面包屑数据
      const {fullPath, breadcrumb} = await generatePathAndBreadcrumb()
      
      // 更新当前文档
      patch.execute([{
        set: {
          fullPath: fullPath,
          breadcrumb: breadcrumb,
        }
      }])
      
      // 稍等待当前文档保存完成
      setTimeout(async () => {
        // 更新所有子文档
        await updateChildDocs(id)
        setIsUpdating(false)
      }, 1000)
      
    } catch (err) {
      console.error('更新路径和面包屑失败:', err)
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    // 如果文档发生变化并且有slug和title，自动计算和更新路径和面包屑
    if (doc && doc.slug && doc.slug.current && doc.title && !isUpdating) {
      handleSaveAndUpdatePaths()
    }
  }, [doc?.slug?.current, doc?.parentArticle?._ref, doc?.title])

  return {
    label: isUpdating ? '正在更新路径结构...' : '更新路径结构',
    onHandle: handleSaveAndUpdatePaths,
    disabled: isUpdating || publish.disabled
  }
}