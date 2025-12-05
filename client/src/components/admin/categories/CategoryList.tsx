import { useState } from 'react';
import { Search, Filter, Grid, List, Table, Plus } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import { useCategories } from '../context/categoryContext';
import { CategoryCard } from './CategoryCard';
import { CategoryTable } from './CategoryTable';
import CategoryFormDialog from './CategoryFormDialog';
import { getCategoryId } from './CategoryUtility';


export function CategoryList() {
  const { categories, loading } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');


  // const dispatch = useDispatch<AppDispatch>();
  // const { items, loading, error } = useSelector(
  //   (state: RootState) => state.categories
  // );

  // useEffect(() => {
  //   dispatch(fetchCategories());
  // }, [dispatch]);


  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'subcategories':
        return b.subcategories.length - a.subcategories.length;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  //if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Categories</h2>
          <p className="text-muted-foreground">
            Manage your product categories and subcategories
          </p>
        </div>
        <CategoryFormDialog
          mode="create"
          trigger={<Button size="sm" className="bg-primary text-white shadow-soft">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="created">Sort by Created</SelectItem>
              <SelectItem value="updated">Sort by Updated</SelectItem>
              <SelectItem value="subcategories">Sort by Subcategories</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              onClick={() => setViewMode('table')}
              className="rounded-l-none"
            >
              <Table className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-foreground">{categories.length}</div>
          <div className="text-sm text-muted-foreground">Total Categories</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-foreground">
            {categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Subcategories</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border/50">
          <div className="text-2xl font-bold text-foreground">{filteredCategories.length}</div>
          <div className="text-sm text-muted-foreground">Showing Results</div>
        </div>
      </div>

      {/* Categories Grid/List/Table */}
      {sortedCategories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchTerm ? 'No categories found matching your search.' : 'No categories yet.'}
          </div>
          {!searchTerm && <CategoryFormDialog
            mode="create"
            trigger={<Button size="sm" className="bg-primary text-white shadow-soft">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>}
          />}
        </div>
      ) : viewMode === 'table' ? (
        <CategoryTable categories={sortedCategories} />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {sortedCategories.map((category) => (
            <CategoryCard key={getCategoryId(category)} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}

