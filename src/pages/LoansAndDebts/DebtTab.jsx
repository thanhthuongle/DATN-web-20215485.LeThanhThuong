import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Button, Modal, Typography } from '@mui/material'
import { StyledBox } from '../Overview/Overview'
import { NumericFormat } from 'react-number-format'
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ContactDebtList from './DebtPopup/ContactDebtList'
import ContactItem from './ContactItem'

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


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800]
    })
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#27ae60',
    ...theme.applyStyles('dark', {
      backgroundColor: '#219150'
    })
  }
}))

function DebtTab({ totalBorrwed, paid, transactiosGrouped, handleOnCollectOrRepay }) {
  // console.log('🚀 ~ DebtTab ~ transactiosGrouped:', transactiosGrouped)
  const [openModal, setOpenModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  const handleOpenModal = async (saving) => {
    setSelectedContact(saving)
    setOpenModal(true)
  }

  useEffect(() => {
    if (selectedContact) {
      const updated = transactiosGrouped.find(
        item => item.lenderId === selectedContact.lenderId
      )
      if (updated) {
        setSelectedContact(updated)
      }
    }
  }, [transactiosGrouped])
  return (
    <Box
      width={'100%'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      gap={2}
    >

      {/* Tổng quan */}
      <StyledBox display={'flex'} flexDirection={'column'} gap={1}>
        {/* <Typography
          component={'div'}
        > Cần trả:
          <NumericFormat
            displayType='text'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            prefix="&nbsp;"
            suffix="&nbsp;₫"
            value={Math.max(Number(totalBorrwed) - Number(paid), 0)}
            style={{ color: '#e74c3c' }}
          />
        </Typography> */}
        <Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
          <Typography
            component={'div'}
          > Đã trả <br />
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={Number(paid)}
              style={{ color: '#05bb51' }}
            />
          </Typography>
          <Typography
            component={'div'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'end'}
          > Tổng đi vay <br />
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={Number(totalBorrwed)}
            />
          </Typography>
        </Box>
        <Box marginBottom={0.25}>
          <BorderLinearProgress variant="determinate" value={Math.min(paid/totalBorrwed, 1)*100} />
        </Box>
      </StyledBox>

      <Box>
        {/* Đang theo dõi */}
        <Accordion sx={{ mb: 1 }} defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="followingDebt-content"
            id="followingDebt-header"
            sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
          >
            <Typography component="span" fontWeight='bold'>Đang theo dõi</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            {/* Danh sách các liên hệ đang theo dõi*/}
            {(transactiosGrouped.some(item => Number(item.totalAmountWithReturn) > 0))
              ? (
                transactiosGrouped.filter(item => Number(item.totalAmountWithReturn) > 0).map((item) =>
                  <Box
                    key={item.lenderId}
                    onClick={() => handleOpenModal(item)}
                  >
                    <ContactItem
                      // key={item.lenderId}
                      contactName={item.transactions[0].detailInfo.lender.name}
                      amount={item.totalAmountWithReturn}
                      amountColor='#27ae60' // #27ae60
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                        borderTop: 1,
                        borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                      }}
                      menuComponent={<Button variant='contained' sx={{ marginLeft: 2 }}>Trả nợ</Button>}
                    />
                  </Box>
                )
              )
              : (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} paddingY={3}>
                  <Typography>Không có khoản nợ nào đang theo dõi!</Typography>
                </Box>
              )
            }
          </AccordionDetails>
        </Accordion>

        {/* Đã hoàn thành */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="finishedDebt-content"
            id="finishedDebt-header"
            sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#FF6E4A' : '#FF3300' }}
          >
            <Typography component="span" fontWeight='bold'>Đã hoàn thành</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            {/* Danh sách các liên hệ đã hoàn thành */}
            {(transactiosGrouped.some(item => Number(item.totalAmountWithReturn) == 0))
              ? (
                transactiosGrouped.filter(item => Number(item.totalAmountWithReturn) == 0).map((item) =>
                  <Box
                    key={item.lenderId}
                    onClick={() => handleOpenModal(item)}
                  >
                    <ContactItem
                      // key={item.lenderId}
                      contactName={item.transactions[0].detailInfo.lender.name}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                        borderTop: 1,
                        borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                      }}
                      menuComponent={<KeyboardArrowRightIcon />}
                    />
                  </Box>
                )
              )
              : (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} paddingY={3}>
                  <Typography>Không có khoản nợ nào đã hoàn thành!</Typography>
                </Box>
              )
            }
          </AccordionDetails>
        </Accordion>
      </Box>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ContactDebtList
            contactDebtData={{ ...selectedContact, lender: selectedContact?.transactions?.[0]?.detailInfo?.lender }}
            handleCancel={() => setOpenModal(false)}
            handleOnCollectOrRepay={handleOnCollectOrRepay}
          />
        </Box>
      </Modal>
    </Box>
  )
}

export default DebtTab
