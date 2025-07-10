import React, { useState } from 'react'
import { StyledBox } from '../Overview/Overview'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { NumericFormat } from 'react-number-format'
import MoneySourceItem2 from './MoneySourceItem/MoneySourceItem2'
import AccumulateMenu from './MoneySourceItem/Accumulatemenu'
import { ButtonBase, Modal } from '@mui/material'
import AccumulationPopup from './DetailPopup/AccumulationPopup'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: 900 },
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 2
}

function AccumulateCard({ data, accountData, refreshData }) {
  const [openModal, setOpenModal] = useState(false)
  const [selectedAccumulation, setSelectedAccumulation] = useState(null)
  // console.log('🚀 ~ AccumulateCard ~ data:', data)
  const accumulateData = data

  const activeAccumulateData = accumulateData.filter(item => !item.isFinish)
  const finishedAccumulateData = accumulateData.filter(item => item.isFinish)

  const totalAmount = accumulateData.reduce((sum, item) => sum + item.balance, 0)
  const totalCount = accumulateData.length

  const activeAmount = activeAccumulateData.reduce((sum, item) => sum + item.balance, 0)
  // const finishedAmount = finishedAccumulateData.reduce((sum, item) => sum + item.balance, 0)

  const handleOpenModal = async (saving) => {
    setSelectedAccumulation(saving)
    setOpenModal(true)
  }
  return (
    <StyledBox
      width='100%'
      minHeight='28vh'
      maxHeight='90vh'
      display={{ lg: 'flex' }}
      style={{ padding: 0 }}
      overflow= 'auto'
    >
      {/* TIêu đề: Tích lũy */}
      <Box width={{ lg: '10%' }} >
        <Typography
          variant='h6'
          fontWeight='bold'
          display='flex'
          flexDirection="column"
          height='100%'
          justifyContent='center'
          alignItems='center'
          bgcolor='#ea008c'
          textAlign="center"
        >TÍCH LŨY</Typography>
      </Box>

      {/* Nội dung tổng quan Tích lũy */}
      <Box
        width={{ xs: '100%', lg: '90%' }}
        maxHeight='100%'
        overflow= 'auto'
        display='flex'
        flexDirection='column'
        paddingX={{ md: 2 }}
        paddingY={2}
        gap={2}
      >
        <Box>
          <Box display='flex' justifyContent='space-around'>
            <Typography>Tổng tiền:&nbsp;(&nbsp;
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={true}
                suffix="&nbsp;₫"
                value={totalAmount}
                style={{ fontWeight: 'bold', maxWidth: '100%', color: totalAmount < 0 ? 'red' : 'inherit' }}
              />&nbsp;)
            </Typography>
            <Typography>Tổng số: {totalCount} tích lũy</Typography>
          </Box>
          <Divider width='80%' sx={{ mx: 'auto', marginTop: 1 }}/>
        </Box>

        <Box>
          {/* Các tích lũy đang theo dõi */}
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="activeWallet-content"
              id="activeWallet-header"
              sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
            >
              <Typography component="span" fontWeight='bold'>Đang theo dõi
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=' ('
                  suffix="&nbsp;₫)"
                  value={activeAmount}
                  style={{ fontWeight: 'bold', maxWidth: '100%' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {/* Danh sách các tích lũy đang theo dõi */}
              {activeAccumulateData?.length == 0 && (
                <Typography display={'flex'} justifyContent={'center'} alignItems={'center'} marginY={2}>Không có khoản tích lũy nào đang the dõi!</Typography>
              )}
              {activeAccumulateData.map((accumulation) =>
                <Box
                  key={accumulation._id}
                  // onClick={() => handleOpenModal(accumulation)}
                >
                  <ButtonBase
                    component='div'
                    onClick={() => handleOpenModal(accumulation)}
                    sx={{ width: '100%', textAlign: 'left' }}
                  >
                    <MoneySourceItem2
                      logo={'https://i.pinimg.com/736x/d2/27/54/d227545d8a52d0344ca75cf7b80eb523.jpg'}
                      key={accumulation._id}
                      title={accumulation.accumulationName}
                      targetAmount={accumulation.targetBalance}
                      accumulatedAmount={accumulation.balance}
                      menuComponent={<AccumulateMenu isFinished={false} accumulation={accumulation} accountData={accountData} refreshData={refreshData} />}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                        transition: 'background-color 0.2s',
                        borderTop: 1,
                        borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                      }}
                    />
                  </ButtonBase>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Các tích lũy đã kết thúc */}
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="inActiveWallet-content"
              id="inActiveWallet-header"
              sx={{ width: '100%', bgcolor: (theme) => theme.palette.mode == 'dark' ? '#FF6E4A' : '#FF3300' }}
            >
              <Typography component="span" fontWeight='bold'>Đã kết thúc
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=' ('
                  suffix="&nbsp;tích lũy)"
                  value={finishedAccumulateData?.length}
                  style={{ fontWeight: 'bold', maxWidth: '100%' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, width: '100%' }}>
              {/* Danh sách các tích lũy đã kết thúc */}
              {finishedAccumulateData?.length == 0 && (
                <Typography display={'flex'} justifyContent={'center'} alignItems={'center'} marginY={2}>Chưa có khoản tích lũy nào kết thúc!</Typography>
              )}
              {finishedAccumulateData.map((accumulation) =>
                <Box
                  key={accumulation._id}
                  // onClick={() => handleOpenModal(accumulation)}
                >
                  <ButtonBase
                    component='div'
                    onClick={() => handleOpenModal(accumulation)}
                    sx={{ width: '100%', textAlign: 'left' }}
                  >
                    <MoneySourceItem2
                      logo={'https://i.pinimg.com/736x/d2/27/54/d227545d8a52d0344ca75cf7b80eb523.jpg'}
                      key={accumulation._id}
                      title={accumulation.accumulationName}
                      targetAmount={accumulation.targetBalance}
                      accumulatedAmount={accumulation.balance}
                      // menuComponent={<AccumulateMenu isFinished={true} accumulation={accumulation} refreshData={refreshData}/>}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                        transition: 'background-color 0.2s',
                        borderTop: 1,
                        borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666',
                        opacity: '50%'
                      }}
                    />
                  </ButtonBase>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AccumulationPopup accumulation={selectedAccumulation} handleCancel={() => setOpenModal(false)} />
        </Box>
      </Modal>
    </StyledBox>
  )
}

export default AccumulateCard