import { Button, CircularProgress, FormControl, MenuItem, Select, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { createSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createIndividualTransactionAPI, getIndividualAccountAPI, getIndividualCategoryAPI } from '~/apis'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { StyledBox } from '~/pages/Overview/Overview'
import { MONEY_SOURCE_TYPE, TRANSACTION_TYPES } from '~/utils/constants'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

function CalcCollection (loanAmount, loanTime, collectTime, rate = 10) {
  const dayOfLoan = moment(collectTime).diff(moment(loanTime), 'days')
  const collectAmount = loanAmount + Math.round((loanAmount*rate*dayOfLoan)/36500)
  return collectAmount
}

function CollectionPopup({ LoanTransaction, handleCancel, handleOnCollect }) {
  // console.log('🚀 ~ CollectionPopup ~ LoanTransaction:', LoanTransaction)
  const [wallets, setWallets] = useState([])
  const [collectCategory, setCollectCategory] = useState(null)

  const methods = useForm()
  const { setValue, control, reset, watch, formState: { errors, isSubmitting } } = methods
  const realCollectTime = watch('realCollectTime')

  const onSubmit = async (data) => {
    // data.loanTransactionId = LoanTransaction._id
    // console.log('🚀 ~ onSubmit ~ data:', data)
    const payload = {
      type: TRANSACTION_TYPES.COLLECT,
      categoryId: collectCategory._id,
      name: collectCategory.name,
      transactionTime: moment(realCollectTime).toISOString(),
      description: `${LoanTransaction?.detailInfo?.borrower?.name} trả`,
      amount: Number(CalcCollection(LoanTransaction?.amount, LoanTransaction?.transactionTime, realCollectTime, LoanTransaction?.detailInfo?.rate)),

      detailInfo: {
        loanTransactionId: LoanTransaction._id,
        borrowerId: LoanTransaction?.detailInfo?.borrower?._id,
        moneyTargetType: MONEY_SOURCE_TYPE.ACCOUNT,
        moneyTargetId: data.moneyTargetId,
        realCollectTime: moment(data.realCollectTime).toISOString()
      }
    }
    // console.log('🚀 ~ onSubmit ~ payload:', payload)

    // Call API
    const res = await toast.promise(
      createIndividualTransactionAPI(payload),
      { pending: 'Đang tạo giao dịch...' }
    )
    if (!res.error) {
      toast.success('Tạo giao dịch thu nợ thành công!')
      reset()
      handleCancel()
      handleOnCollect()
    }
  }

  useEffect(() => {
    getIndividualAccountAPI().then((res) => {
      setWallets(res)
      if (res?.[0]?._id) {
        setValue('moneyTargetId', res[0]._id)
      }
    })

    getIndividualCategoryAPI(`?${createSearchParams({ 'q[type]': TRANSACTION_TYPES.COLLECT })}`).then(res => {
      if (res?.[0]) setCollectCategory(res[0])
    })
  }, [setValue])
  return (
    <Box>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {/* Tiêu đề */}
        <Box bgcolor={'#00aff0'} paddingY={2} display={'flex'} justifyContent={'center'}>
          <Typography fontWeight={'bold'}>Thu nợ</Typography>
        </Box>

        {/* Thông tin khoản vay */}
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <StyledBox display={'flex'} flexDirection={'column'} gap={1}>
            <Typography>Người vay: {LoanTransaction?.detailInfo?.borrower?.name}</Typography>
            <Typography>Số tiền cho vay:&nbsp;
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                suffix="&nbsp;₫"
                value={LoanTransaction?.amount}
                style={{ color: '#e74c3c', fontWeight: 'bold' }} // #e74c3c
              />
            </Typography>
            <Typography>Lãi suất: {LoanTransaction?.detailInfo?.rate} %/năm</Typography>
            <Typography>Thời gian vay: {moment(LoanTransaction?.transactionTime).format('DD/MM/YYYY, LT')}</Typography>
            {LoanTransaction?.detailInfo?.collectTime &&<Typography>Thời gian thu dự kiến: {moment(LoanTransaction?.detailInfo?.collectTime).format('DD/MM/YYYY, LT')}</Typography>}
          </StyledBox>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <StyledBox display={'flex'} flexDirection={'column'} gap={2.5}>
                {/* Thời gian thu tiền */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ flexShrink: 0 }}>Thời gian thu thực tế &nbsp;</Typography>
                    <Controller
                      control={control}
                      name="realCollectTime"
                      rules={{
                        required: FIELD_REQUIRED_MESSAGE,
                        validate: (value) => {
                          const min = moment(LoanTransaction?.transactionTime)
                          const max = moment()

                          if (moment(value).isBefore(min)) return 'Không thể thu nợ trước thời điểm cho vay'
                          else if (moment(value).isAfter(max)) return 'Không thể thu nợ tại thời điểm ở tương lai'

                          return true
                        }
                      }}
                      defaultValue={
                        LoanTransaction?.detailInfo?.collectTime
                          ? moment(LoanTransaction?.detailInfo?.collectTime).isAfter(moment()) ? moment() : moment(LoanTransaction?.detailInfo?.collectTime)
                          : moment()
                      }
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DateTimePicker
                          ampm={false}
                          timeSteps={{ hours: 1, minutes: 1 }}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!errors['realCollectTime']}
                          disableFuture={true}
                          minDateTime={moment(LoanTransaction?.transactionTime)}
                        />
                      )}
                    />
                  </Box>
                  <Box marginLeft={'100px'}>
                    <FieldErrorAlert errors={errors} fieldName={'realCollectTime'}/>
                  </Box>
                </Box>

                {/* Số tiền sẽ thu */}
                <Typography>Số tiền cần thu:&nbsp;
                  <NumericFormat
                    displayType='text'
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    suffix="&nbsp;₫"
                    value={CalcCollection(LoanTransaction?.amount, LoanTransaction?.transactionTime, realCollectTime, LoanTransaction?.detailInfo?.rate)}
                    style={{ color: '#27ae60', fontWeight: 'bold' }} // #27ae60
                  />
                </Typography>

                {/* Nơi nhận tiền */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ flexShrink: 0 }}>Tài khoản nhận &nbsp;</Typography>
                    <Box sx={{ width: '100%' }}>
                      <Controller
                        control={control}
                        rules={{ required: FIELD_REQUIRED_MESSAGE }}
                        name="moneyTargetId"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <FormControl fullWidth>
                            <Select
                              labelId="wallet-select-label"
                              id="wallet-select"
                              value={value || ''}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={!!errors['moneyTargetId']}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 250,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                            >
                              {wallets?.map((w, index) => (
                                <MenuItem value={w._id} key={index}>
                                  <FinanceItem1
                                    logo={w?.icon}
                                    title={w.accountName}
                                    amount={w.balance}
                                    sx={{ padding: 0, paddingY: 0.25 }}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Box>
                  </Box>
                  <Box marginLeft={'100px'}>
                    <FieldErrorAlert errors={errors} fieldName={'moneyTargetId'}/>
                  </Box>
                </Box>
              </StyledBox>
              <Box display={'flex'} justifyContent={'center'} marginTop={5} gap={3}>
                <Button variant='outlined' onClick={handleCancel}>Hủy</Button>
                <Button
                  variant='contained'
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress size={20} />}
                >{isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}</Button>
              </Box>
            </form>
          </FormProvider>
        </Box>
      </Box>
    </Box>
  )
}

export default CollectionPopup
