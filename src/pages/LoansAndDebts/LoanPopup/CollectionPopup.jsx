import { Avatar, Button, FormControl, MenuItem, Select, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'
import { getIndividualAccountAPI } from '~/apis'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { StyledBox } from '~/pages/Overview/Overview'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

function CalcCollection (loanAmount, loanTime, collectTime, rate = 10) {
  const dayOfLoan = moment(collectTime).diff(moment(loanTime), 'days')
  const collectAmount = loanAmount + Math.round((loanAmount*rate*dayOfLoan)/36500)
  return collectAmount
}

function CollectionPopup({ LoanTransaction, handleCancel }) {
  // console.log('🚀 ~ CollectionPopup ~ LoanTransaction:', LoanTransaction)
  const [wallets, setWallets] = useState([])

  const methods = useForm()
  const { setValue, control, reset, watch, formState: { errors } } = methods
  const realCollectTime = watch('realCollectTime')

  const onSubmit = (data) => {
    data.loanTransactionId = LoanTransaction._id
    console.log('🚀 ~ onSubmit ~ data:', data)

    // TODO: Call API
    reset()
    handleCancel()
  }

  useEffect(() => {
    getIndividualAccountAPI().then((res) => {
      setWallets(res)
      if (res?.[0]?._id) {
        setValue('moneyTargetId', res[0]._id)
      }
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
            <Typography>Lãi suất: %/năm</Typography>
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
                    value={CalcCollection(LoanTransaction?.amount, LoanTransaction?.transactionTime, realCollectTime)}
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
                              renderValue={(value) => {
                                const selectedWallet = wallets.find(w => w._id === value)
                                return (
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar
                                      alt="Logo"
                                      src=""
                                      sx={{
                                        bgcolor: 'yellow',
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0
                                      }}
                                    >
                                      {' '}
                                    </ Avatar>
                                    <Typography noWrap>
                                      {selectedWallet?.accountName}&nbsp;({selectedWallet?.balance?.toLocaleString()}&nbsp;₫)
                                    </Typography>
                                  </Box>
                                )
                              }}
                            >
                              {wallets?.map((w, index) => (
                                <MenuItem value={w._id} key={index}>
                                  <FinanceItem1
                                    title={w.accountName}
                                    amount={w.balance}
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
                <Button variant='contained' type="submit" className='interceptor-loading'>Xác nhận</Button>
              </Box>
            </form>
          </FormProvider>
        </Box>
      </Box>
    </Box>
  )
}

export default CollectionPopup
