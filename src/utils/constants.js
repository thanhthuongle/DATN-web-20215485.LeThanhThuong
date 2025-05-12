export const startDayOfWeekOptions = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật'
]
export const languageOptions = ['Tiếng Việt']
export const currencyOptions = ['VND']
export const startDayOfMonthOptions = Array.from({ length: 28 }, (_, i) => (i + 1).toString())

export const categoryExpenseDefault = [
  {
    categoryId: '001',
    isDefault: true,
    categoryName: 'Ăn uống',
    icon: null,
    childrenIds: [
      '002',
      '003',
      '004',
      '005',
      '006',
      '007'
    ],
    parentId: null
  },
  {
    categoryId: '002',
    isDefault: true,
    categoryName: 'Ăn sáng',
    icon: null,
    childrenIds: [],
    parentId: '001'
  },
  {
    categoryId: '003',
    isDefault: true,
    categoryName: 'Ăn tiệm',
    icon: null,
    childrenIds: [],
    parentId: '001'
  },
  {
    categoryId: '004',
    isDefault: true,
    categoryName: 'Ăn tối',
    icon: null,
    childrenIds: [],
    parentId: '001'
  },
  {
    categoryId: '005',
    isDefault: true,
    categoryName: 'Ăn trưa',
    icon: null,
    childrenIds: [],
    parentId: '001'
  },
  {
    categoryId: '006',
    isDefault: true,
    categoryName: 'Cafe',
    icon: null,
    childrenIds: [],
    parentId: '001'
  },
  {
    categoryId: '007',
    isDefault: true,
    categoryName: 'Đi chợ/siêu thị',
    icon: null,
    childrenIds: [],
    parentId: '001'
  },
  {
    categoryId: '008',
    isDefault: true,
    categoryName: 'Con cái',
    icon: null,
    childrenIds: [
      '009',
      '010',
      '011',
      '012',
      '013'
    ],
    parentId: null
  },
  {
    categoryId: '009',
    isDefault: true,
    categoryName: 'Đồ chơi',
    icon: null,
    childrenIds: [],
    parentId: '008'
  },
  {
    categoryId: '010',
    isDefault: true,
    categoryName: 'Học phí',
    icon: null,
    childrenIds: [],
    parentId: '008'
  },
  {
    categoryId: '011',
    isDefault: true,
    categoryName: 'Sách vở',
    icon: null,
    childrenIds: [],
    parentId: '008'
  },
  {
    categoryId: '012',
    isDefault: true,
    categoryName: 'Sữa',
    icon: null,
    childrenIds: [],
    parentId: '008'
  },
  {
    categoryId: '013',
    isDefault: true,
    categoryName: 'Tiền tiêu vặt',
    icon: null,
    childrenIds: [],
    parentId: '008'
  },
  {
    categoryId: '014',
    isDefault: true,
    categoryName: 'Dịch vụ sinh hoạt',
    icon: null,
    childrenIds: [
      '015',
      '016',
      '017',
      '018',
      '019',
      '020',
      '021',
      '022'
    ],
    parentId: null
  },
  {
    categoryId: '015',
    isDefault: true,
    categoryName: 'Điện',
    icon: null,
    childrenIds: [],
    parentId: '014'
  },
  {
    categoryId: '016',
    isDefault: true,
    categoryName: 'Điện thoại cố định',
    icon: null,
    childrenIds: [],
    parentId: '014'
  },
  {
    categoryId: '017',
    isDefault: true,
    categoryName: 'Điện thoại di động',
    icon: null,
    childrenIds: [],
    parentId: '014'
  },
  {
    categoryId: '018',
    isDefault: true,
    categoryName: 'Gas',
    icon: null,
    childrenIds: [],
    parentId: '014'
  },
  {
    categoryId: '019',
    isDefault: true,
    categoryName: 'Internet',
    icon: null,
    childrenIds: [],
    parentId: '014'
  },
  {
    categoryId: '020',
    isDefault: true,
    categoryName: 'Nước',
    icon: null,
    childrenIds: [],
    parentId: '014'
  },
  {
    categoryId: '021',
    isDefault: true,
    categoryName: 'Thuê người giúp việc',
    icon: null,
    childrenIds: [],
    parentId: '014'
  },
  {
    categoryId: '022',
    isDefault: true,
    categoryName: 'Truyền hình',
    icon: null,
    childrenIds: [],
    parentId: '014'
  },
  {
    categoryId: '023',
    isDefault: true,
    categoryName: 'Đi lại',
    icon: null,
    childrenIds: [
      '024',
      '025',
      '026',
      '027',
      '028',
      '029'
    ],
    parentId: null
  },
  {
    categoryId: '024',
    isDefault: true,
    categoryName: 'Bảo hiểm xe',
    icon: null,
    childrenIds: [],
    parentId: '023'
  },
  {
    categoryId: '025',
    isDefault: true,
    categoryName: 'Gửi xe',
    icon: null,
    childrenIds: [],
    parentId: '023'
  },
  {
    categoryId: '026',
    isDefault: true,
    categoryName: 'Rửa xe',
    icon: null,
    childrenIds: [],
    parentId: '023'
  },
  {
    categoryId: '027',
    isDefault: true,
    categoryName: 'Sửa chữa, bảo dưỡng xe',
    icon: null,
    childrenIds: [],
    parentId: '023'
  },
  {
    categoryId: '028',
    isDefault: true,
    categoryName: 'Taxi/thuê xe',
    icon: null,
    childrenIds: [],
    parentId: '023'
  },
  {
    categoryId: '029',
    isDefault: true,
    categoryName: 'Xăng xe',
    icon: null,
    childrenIds: [],
    parentId: '023'
  },
  {
    categoryId: '030',
    isDefault: true,
    categoryName: 'Hiếu hỉ',
    icon: null,
    childrenIds: [
      '031',
      '032',
      '033',
      '034'
    ],
    parentId: null
  },
  {
    categoryId: '031',
    isDefault: true,
    categoryName: 'Biếu tặng',
    icon: null,
    childrenIds: [],
    parentId: '030'
  },
  {
    categoryId: '032',
    isDefault: true,
    categoryName: 'Cưới xin',
    icon: null,
    childrenIds: [],
    parentId: '030'
  },
  {
    categoryId: '033',
    isDefault: true,
    categoryName: 'Ma chay',
    icon: null,
    childrenIds: [],
    parentId: '030'
  },
  {
    categoryId: '034',
    isDefault: true,
    categoryName: 'Thăm hỏi',
    icon: null,
    childrenIds: [],
    parentId: '030'
  },
  {
    categoryId: '035',
    isDefault: true,
    categoryName: 'Hưởng thụ',
    icon: null,
    childrenIds: [
      '036',
      '037',
      '038',
      '039',
      '040'
    ],
    parentId: null
  },
  {
    categoryId: '036',
    isDefault: true,
    categoryName: 'Du lịch',
    icon: null,
    childrenIds: [],
    parentId: '035'
  },
  {
    categoryId: '037',
    isDefault: true,
    categoryName: 'Làm đẹp',
    icon: null,
    childrenIds: [],
    parentId: '035'
  },
  {
    categoryId: '038',
    isDefault: true,
    categoryName: 'Mỹ phẩm',
    icon: null,
    childrenIds: [],
    parentId: '035'
  },
  {
    categoryId: '039',
    isDefault: true,
    categoryName: 'Phim ảnh ca nhạc',
    icon: null,
    childrenIds: [],
    parentId: '035'
  },
  {
    categoryId: '040',
    isDefault: true,
    categoryName: 'Vui chơi giải trí',
    icon: null,
    childrenIds: [],
    parentId: '035'
  },
  {
    categoryId: '041',
    isDefault: true,
    categoryName: 'Ngân hàng',
    icon: null,
    childrenIds: [
      '042'
    ],
    parentId: null
  },
  {
    categoryId: '042',
    isDefault: true,
    categoryName: 'Phí chuyển khoản',
    icon: null,
    childrenIds: [],
    parentId: '041'
  },
  {
    categoryId: '043',
    isDefault: true,
    categoryName: 'Nhà cửa',
    icon: null,
    childrenIds: [
      '044',
      '045',
      '046'
    ],
    parentId: null
  },
  {
    categoryId: '044',
    isDefault: true,
    categoryName: 'Mua sắm đồ đạc',
    icon: null,
    childrenIds: [],
    parentId: '043'
  },
  {
    categoryId: '045',
    isDefault: true,
    categoryName: 'Sửa chữa nhà cửa',
    icon: null,
    childrenIds: [],
    parentId: '043'
  },
  {
    categoryId: '046',
    isDefault: true,
    categoryName: 'Thuê nhà',
    icon: null,
    childrenIds: [],
    parentId: '043'
  },
  {
    categoryId: '047',
    isDefault: true,
    categoryName: 'Phát triển bản thân',
    icon: null,
    childrenIds: [
      '048',
      '049'
    ],
    parentId: null
  },
  {
    categoryId: '048',
    isDefault: true,
    categoryName: 'Giao lưu, quan hệ',
    icon: null,
    childrenIds: [],
    parentId: '047'
  },
  {
    categoryId: '049',
    isDefault: true,
    categoryName: 'Học hành',
    icon: null,
    childrenIds: [],
    parentId: '047'
  },
  {
    categoryId: '050',
    isDefault: true,
    categoryName: 'Sức khỏe',
    icon: null,
    childrenIds: [
      '051',
      '052',
      '053'
    ],
    parentId: null
  },
  {
    categoryId: '051',
    isDefault: true,
    categoryName: 'Khám chữa bệnh',
    icon: null,
    childrenIds: [],
    parentId: '050'
  },
  {
    categoryId: '052',
    isDefault: true,
    categoryName: 'Thể thao',
    icon: null,
    childrenIds: [],
    parentId: '050'
  },
  {
    categoryId: '053',
    isDefault: true,
    categoryName: 'Thuốc men',
    icon: null,
    childrenIds: [],
    parentId: '050'
  },
  {
    categoryId: '054',
    isDefault: true,
    categoryName: 'Trang phục',
    icon: null,
    childrenIds: [
      '055',
      '056',
      '057'
    ],
    parentId: null
  },
  {
    categoryId: '055',
    isDefault: true,
    categoryName: 'Giày dép',
    icon: null,
    childrenIds: [],
    parentId: '054'
  },
  {
    categoryId: '056',
    isDefault: true,
    categoryName: 'Phụ kiện khác',
    icon: null,
    childrenIds: [],
    parentId: '054'
  },
  {
    categoryId: '057',
    isDefault: true,
    categoryName: 'Quần áo',
    icon: null,
    childrenIds: [],
    parentId: '054'
  }
]

export const categoryIncomeDefault = [
  {
    categoryId: '001',
    isDefault: true,
    categoryName: 'Được cho/tặng',
    icon: null,
    childrenIds: [],
    parentId: null
  },
  {
    categoryId: '002',
    isDefault: true,
    categoryName: 'Khác',
    icon: null,
    childrenIds: [],
    parentId: null
  },
  {
    categoryId: '003',
    isDefault: true,
    categoryName: 'Lương',
    icon: null,
    childrenIds: [],
    parentId: null
  },
  {
    categoryId: '004',
    isDefault: true,
    categoryName: 'Thưởng',
    icon: null,
    childrenIds: [],
    parentId: null
  },
  {
    categoryId: '005',
    isDefault: true,
    categoryName: 'Tiền lãi',
    icon: null,
    childrenIds: [],
    parentId: null
  }
]

export const apiRoot = import.meta.env.VITE_API_URL
