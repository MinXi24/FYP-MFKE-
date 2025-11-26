import Ionicons from "@expo/vector-icons/Ionicons"
import React, { useMemo, useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const { width } = Dimensions.get("window")
// Calculate item width for a 2-column grid with 16px outer padding and 12px inner gutter.
// Total horizontal space taken: (16*2) outer + 12 inner = 44px. This ensures perfect edge alignment.
const itemWidth = (width - 44) / 2 

// 1. Define the Product Interface
interface Product {
  id: string // IDs are strings in MOCK_PRODUCTS
  name: string
  rating: number
  reviews: number
  image: string
  trending: boolean
  liked: boolean
}

// Updated MOCK_PRODUCTS
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Allen Solly Regular fit cotton shirt",
    rating: 4.3,
    reviews: 41,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=300&fit=crop",
    trending: false,
    liked: false,
  },
  {
    id: "2",
    name: "Calvin Klein Regular fit slim fit shirt",
    rating: 4.1,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1589992595173-cf793772b0b7?w=300&h=300&fit=crop",
    trending: false,
    liked: false,
  },
  {
    id: "3",
    name: "H&M Regular fit cotton shirt",
    rating: 4.3,
    reviews: 41,
    image: "https://images.unsplash.com/photo-1570783830852-1b2f30bb2cff?w=300&h=300&fit=crop",
    trending: false,
    liked: false,
  },
  {
    id: "4",
    name: "Calvin Klein Regular fit casual shirt",
    rating: 4.8,
    reviews: 692,
    image: "https://images.unsplash.com/photo-1596362776919-f10e4e75c3d1?w=300&h=300&fit=crop",
    trending: true,
    liked: false,
  },
  {
    id: "5",
    name: "Premium Cotton Casual Shirt",
    rating: 4.5,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1596185605138-79249dd5a22f?w=300&h=300&fit=crop",
    trending: true,
    liked: false,
  },
  {
    id: "6",
    name: "Classic Denim Button Up",
    rating: 4.2,
    reviews: 356,
    image: "https://images.unsplash.com/photo-1602810314498-2c5fc9d15cd0?w=300&h=300&fit=crop",
    trending: false,
    liked: false,
  },
]

export default function CategoryProductsScreen() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterModal, setFilterModal] = useState(false)
  const [sortModal, setSortModal] = useState(false)
  const [selectedSort, setSelectedSort] = useState("newest")
  const [minRating, setMinRating] = useState(0)

  // Apply search, filter, and sort
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRating = product.rating >= minRating
      return matchesSearch && matchesRating
    })

    // Sort: only supporting 'newest' and 'rating' now that price is removed
    const sorted = [...filtered].sort((a, b) => {
      if (selectedSort === "rating") return b.rating - a.rating
      // For "newest" or any other value, maintain original order (or no specific sort)
      return 0
    })

    return sorted
  }, [products, searchQuery, minRating, selectedSort])

  // Fix 1: Explicitly type 'productId' as 'string'
  const toggleLike = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === productId ? { ...product, liked: !product.liked } : product)),
    )
  }

  // Use the Product interface for item type
  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />

        {/* Trending Badge */}
        {item.trending && (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>Trending</Text>
          </View>
        )}

        {/* Like Button */}
        <TouchableOpacity style={styles.likeButton} onPress={() => toggleLike(item.id)}>
          <Ionicons name={item.liked ? "heart" : "heart-outline"} size={20} color={item.liked ? "#FF4458" : "#999"} />
        </TouchableOpacity>
      </View>

      {/* --- START: Fixed Height Container for consistent alignment --- 
        This wrapper uses 'space-between' to push the button block down, 
        but now the title and rating are correctly grouped as a single block.
      */}
      <View style={styles.productDetailsContainer}>
        
        {/* Title and Rating GROUP (NEW WRAPPER) */}
        <View> 
            {/* Product Info */}
            <Text style={styles.productName} numberOfLines={2}>
            {item.name}
            </Text>

            {/* Rating */}
            <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.ratingText}>
                {item.rating} ({item.reviews})
            </Text>
            </View>
        </View>

        {/* Swap Button (Pushed to bottom) */}
        <TouchableOpacity style={styles.swapButton}>
          <Text style={styles.swapButtonText}>Swap Now</Text>
        </TouchableOpacity>
      </View>
      {/* --- END: Fixed Height Container --- */}
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jeans</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 12 }}>
            <Ionicons name="bag-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Item Count */}
      <Text style={styles.itemCount}>{filteredProducts.length} Items</Text>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        // Changing to true to allow scrolling the product list
        scrollEnabled={true} 
      />

      {/* Filter and Sort Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => setFilterModal(true)}>
          <Ionicons name="options-outline" size={20} color="#666" />
          <Text style={styles.footerButtonText}>Filter</Text>
        </TouchableOpacity>

        <View style={styles.footerDivider} />

        <TouchableOpacity style={styles.footerButton} onPress={() => setSortModal(true)}>
          <Ionicons name="swap-vertical-outline" size={20} color="#666" />
          <Text style={styles.footerButtonText}>Sort By</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" transparent onRequestClose={() => setFilterModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter</Text>
              <TouchableOpacity onPress={() => setFilterModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Removed Price Range section */}
              
              <Text style={styles.filterLabel}>Minimum Rating</Text>
              <View style={styles.ratingFilter}>
                {[0, 3, 3.5, 4, 4.5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[styles.ratingOption, minRating === rating && styles.ratingOptionActive]}
                    onPress={() => setMinRating(rating)}
                  >
                    <Text style={[styles.ratingOptionText, minRating === rating && styles.ratingOptionTextActive]}>
                      {rating === 0 ? "Any" : `${rating}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.applyButton} onPress={() => setFilterModal(false)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={sortModal} animationType="slide" transparent onRequestClose={() => setSortModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setSortModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Removed price sorting options */}
              {[
                { label: "Newest", value: "newest" },
                { label: "Rating", value: "rating" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.sortOption, selectedSort === option.value && styles.sortOptionActive]}
                  onPress={() => {
                    setSelectedSort(option.value)
                    setSortModal(false)
                  }}
                >
                  <Text style={[styles.sortOptionText, selectedSort === option.value && styles.sortOptionTextActive]}>
                    {option.label}
                  </Text>
                  {selectedSort === option.value && <Ionicons name="checkmark" size={20} color="#22C55E" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Georgia",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#000",
  },
  itemCount: {
    fontSize: 12,
    color: "#999",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  listContent: {
    // Increased padding to 16px to align perfectly with the header/search bar,
    // and account for the outer spacing defined in itemWidth calculation.
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  productCard: {
    width: itemWidth,
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: itemWidth,
    marginBottom: 8,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  trendingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#22C55E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  trendingText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  likeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  // NEW STYLE: Container to enforce a consistent height for the details area.
  productDetailsContainer: {
    // Height calculated to comfortably fit 2 lines of text, rating, and the swap button.
    minHeight: 110, 
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
    marginBottom: 6, // Added small margin for better spacing within the title/rating group
    fontFamily: "Times New Roman",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0, // Removed vertical margin as spacing is now primarily controlled by the parent flex container
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  swapButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  swapButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingVertical: 12,
  },
  footerButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginLeft: 6,
  },
  footerDivider: {
    width: 1,
    backgroundColor: "#F0F0F0",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  // Removed filterRange and filterValue styles as they are unused now
  ratingFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  ratingOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  ratingOptionActive: {
    backgroundColor: "#22C55E",
  },
  ratingOptionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  ratingOptionTextActive: {
    color: "#FFFFFF",
  },
  applyButton: {
    backgroundColor: "#22C55E",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sortOptionActive: {
    // Note: Applying background color here for visual feedback.
    backgroundColor: "#E0F2F1", 
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  sortOptionTextActive: {
    color: "#22C55E",
    fontWeight: "600",
  },
})