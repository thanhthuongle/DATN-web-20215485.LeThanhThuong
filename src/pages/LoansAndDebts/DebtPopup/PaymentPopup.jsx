import { Avatar, Box, Button, FormControl, MenuItem, Select, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
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

function PaymentPopup({ DebtTransaction, handleCancel }) {
  console.log('🚀 ~ PaymentPopup ~ DebtTransaction:', DebtTransaction)
  const [wallets, setWallets] = useState([])

  const methods = useForm()
  const { setValue, control, reset, watch, formState: { errors } } = methods
  const realRepaymentTime = watch('realRepaymentTime')

  const onSubmit = (data) => {
    data.borrowingTransactionId = DebtTransaction._id
    console.log('🚀 ~ onSubmit ~ data:', data)

    // TODO: Call API
    reset()
    handleCancel()
  }


  useEffect(() => {
    getIndividualAccountAPI().then((res) => {
      setWallets(res)
      if (res?.[0]?._id) {
        setValue('moneyFromId', res[0]._id)
      }
    })
  }, [setValue])
  return (
    <Box>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {/* Tiêu đề */}
        <Box bgcolor={'#00aff0'} paddingY={2} display={'flex'} justifyContent={'center'}>
          <Typography fontWeight={'bold'}>Trả nợ</Typography>
        </Box>

        {/* Thông tin khoản vay */}
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          {/* Thông tin đi vay  */}
          <StyledBox display={'flex'} flexDirection={'column'} gap={1}>
            <Typography>Người cho vay: {DebtTransaction?.detailInfo?.lender?.name}</Typography>
            <Typography>Số tiền đi vay:&nbsp;
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                suffix="&nbsp;₫"
                value={DebtTransaction?.amount}
                style={{ color: '#27ae60', fontWeight: 'bold' }} // #27ae60
              />
            </Typography>
            <Typography>Lãi suất: %/năm</Typography>
            <Typography>Thời gian vay: {moment(DebtTransaction?.transactionTime).format('DD/MM/YYYY, LT')}</Typography>
            {DebtTransaction?.detailInfo?.repaymentTime &&<Typography>Thời gian trả dự kiến: {moment(DebtTransaction?.detailInfo?.repaymentTime).format('DD/MM/YYYY, LT')}</Typography>}
          </StyledBox>

          {/* Thông tin trả nợ */}
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <StyledBox display={'flex'} flexDirection={'column'} gap={2.5}>
                {/* Thời gian thu tiền */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ flexShrink: 0 }}>Thời gian trả thực tế &nbsp;</Typography>
                    <Controller
                      control={control}
                      name="realRepaymentTime"
                      rules={{
                        required: FIELD_REQUIRED_MESSAGE,
                        validate: (value) => {
                          const min = moment(DebtTransaction?.transactionTime)
                          const max = moment()

                          if (moment(value).isBefore(min)) return 'Không thể trả nợ trước thời điểm đi vay'
                          else if (moment(value).isAfter(max)) return 'Không thể trả nợ tại thời điểm ở tương lai'

                          return true
                        }
                      }}
                      defaultValue={
                        DebtTransaction?.detailInfo?.repaymentTime
                          ? moment(DebtTransaction?.detailInfo?.repaymentTime).isAfter(moment()) ? moment() : moment(DebtTransaction?.detailInfo?.repaymentTime)
                          : moment()
                      }
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DateTimePicker
                          ampm={false}
                          timeSteps={{ hours: 1, minutes: 1 }}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!errors['realRepaymentTime']}
                          disableFuture={true}
                          minDateTime={moment(DebtTransaction?.transactionTime)}
                        />
                      )}
                    />
                  </Box>
                  <Box marginLeft={'100px'}>
                    <FieldErrorAlert errors={errors} fieldName={'realRepaymentTime'}/>
                  </Box>
                </Box>

                {/* Số tiền sẽ thu */}
                <Typography>Số tiền cần trả:&nbsp;
                  <NumericFormat
                    displayType='text'
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    suffix="&nbsp;₫"
                    value={CalcCollection(DebtTransaction?.amount, DebtTransaction?.transactionTime, realRepaymentTime)}
                    style={{ color: '#e74c3c', fontWeight: 'bold' }} // #e74c3c
                  />
                </Typography>

                {/* NGuồn tiền */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ flexShrink: 0 }}>Nguồn tiền &nbsp;</Typography>
                    <Box sx={{ width: '100%' }}>
                      <Controller
                        control={control}
                        rules={{ required: FIELD_REQUIRED_MESSAGE }}
                        name="moneyFromId"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <FormControl fullWidth>
                            <Select
                              labelId="wallet-select-label"
                              id="wallet-select"
                              value={value || ''}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={!!errors['moneyFromId']}
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
                    <FieldErrorAlert errors={errors} fieldName={'moneyFromId'}/>
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

export default PaymentPopup
