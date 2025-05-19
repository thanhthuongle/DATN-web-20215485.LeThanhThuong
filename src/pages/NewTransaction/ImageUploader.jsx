import React, { useEffect, useRef, useState } from 'react'
import { Button, Dialog, DialogContent, IconButton, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { singleFileValidator } from '~/utils/validators'

export default function ImageUploader({ value = [], onChange }) {
  const fileInputRef = useRef(null)
  const [images, setImages] = useState(value)
  const [preview, setPreview] = useState(null)

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files)
    const existingKeys = new Set(images.map(img => img?.file?.name + img?.file?.size + img?.file?.lastModified))

    const newImages = []
    for (let file of files) {
      const fileKey = file.name + file.size + file.lastModified

      const error = singleFileValidator(file)
      if (error) {
        toast.error(`Ảnh ${file.name}: ${error}`)
        continue
      }

      if (!existingKeys.has(fileKey)) {
        newImages.push({
          file,
          url: URL.createObjectURL(file)
        })
      } else toast.warn(`Ảnh ${file?.name} đã được chọn trước đó`)
    }

    const limitedImages = newImages.slice(0, 5 - images.length)
    const updatedImages = [...images, ...limitedImages]
    setImages(updatedImages)
    onChange?.(updatedImages)
    event.target.value = '' // reset input
  }

  const handleRemoveImage = (index) => {
    const img = images[index]
    URL.revokeObjectURL(img.url)
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onChange?.(newImages)
  }

  useEffect(() => {
    if (!value) setImages([])
    else setImages(value)
  }, [value])

  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      <Button
        variant="contained"
        onClick={() => fileInputRef.current.click()}
        disabled={images.length >= 5}
        sx={{ textTransform: 'none' }}
      >
        Chọn ảnh ({images.length}/5)
      </Button>

      <Box mt={2} display="flex" gap={1} flexWrap="wrap">
        {images.map((img, index) => (
          <Box
            key={index}
            position="relative"
            width={120}
            height={120}
            border="1px solid #ccc"
            borderRadius={1}
            overflow="hidden"
            sx={{ cursor: 'pointer' }}
            onClick={() => setPreview(img.url)}
          >
            <img
              src={img.url}
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                backgroundColor: 'white',
                boxShadow: 1
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage(index)
              }}
            >
              <CloseIcon sx={{ color: 'red' }} fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Dialog open={!!preview} onClose={() => setPreview(null)}>
        <DialogContent>
          <img src={preview} alt="Phóng to" style={{ maxWidth: '100%' }} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
