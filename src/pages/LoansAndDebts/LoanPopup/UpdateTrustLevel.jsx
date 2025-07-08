import { Box, Button, CircularProgress, FormControl, Modal, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { updateTrustLevel } from '~/apis'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { TRUST_LEVEL_CONTACT } from '~/utils/constants'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: 700 },
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function UpdateTrustLevel({ isOpen, onClose, contact, afterUpdate }) {
  console.log('🚀 ~ UpdateTrustLevel ~ contact:', contact)
  const methods = useForm()
  const { control, watch, reset, setValue, formState: { errors, isSubmitting } } = methods
  const trustLevel = watch('trustLevel')

  const onSubmit = (data) => {
    // console.log('🚀 ~ onSubmit ~ data:', data)
    let payload = {}
    payload = {
      contactId: contact?._id,
      trustLevel: data?.trustLevel
    }
    // console.log('🚀 ~ onSubmit ~ payload:', payload)
    toast.promise(
      updateTrustLevel(payload),
      { pending: 'Đang Cập nhật mức uy tín của liên hệ...' }
    ).then(async res => {
      if (!res.error) {
        toast.success('Cập nhật mức uy tín của liên hệ thành công!')
        onClose()
        reset()
        afterUpdate()
      }
    })
  }

  useEffect(() => {
    setValue('trustLevel', contact?.trustLevel ? contact?.trustLevel : TRUST_LEVEL_CONTACT.NORMAL)
  }, [contact])

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box textAlign={'center'}>
            <Typography>Cập nhật mức uy tín - <strong>{contact?.name}</strong></Typography>
          </Box>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={2}>
                <Box>
                  <Box sx={{ width: '100%' }}>
                    <Controller
                      control={control}
                      rules={{ required: FIELD_REQUIRED_MESSAGE }}
                      name="trustLevel"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <FormControl>
                          <FormLabel id="trust-level-radio-group-label" >Chọn mức uy tín</FormLabel>
                          <RadioGroup
                            aria-labelledby="trust-level-radio-group-label"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            ref={ref}
                          >
                            <FormControlLabel
                              value={TRUST_LEVEL_CONTACT.NORMAL}
                              label="Bình thường"
                              control={<Radio checked={trustLevel == TRUST_LEVEL_CONTACT.NORMAL} />}
                            />
                            <FormControlLabel
                              value={TRUST_LEVEL_CONTACT.GOOD}
                              label="Đáng tin cậy"
                              control={<Radio checked={trustLevel == TRUST_LEVEL_CONTACT.GOOD} color='success' />}
                            />
                            <FormControlLabel
                              value={TRUST_LEVEL_CONTACT.WARNING}
                              label="Cảnh báo"
                              control={<Radio checked={trustLevel == TRUST_LEVEL_CONTACT.WARNING} color='warning' />}
                            />
                            <FormControlLabel
                              value={TRUST_LEVEL_CONTACT.BAD}
                              label="Kém"
                              control={<Radio checked={trustLevel == TRUST_LEVEL_CONTACT.BAD} color='error' />}
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Box>
                    <FieldErrorAlert errors={errors} fieldName={'trustLevel'}/>
                  </Box>
                </Box>

                {/* submit */}
                <Box display={'flex'} justifyContent={'center'} marginTop={2} gap={3}>
                  <Button variant='outlined' onClick={onClose}>Hủy</Button>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={isSubmitting && <CircularProgress size={20} />}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
                  </Button>
                </Box>
              </Box>
            </form>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  )
}

export default UpdateTrustLevel
