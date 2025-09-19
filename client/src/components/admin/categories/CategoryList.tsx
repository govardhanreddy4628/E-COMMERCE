import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../ui/select';
import { useCategories } from '../../../context/CategoryContext';
import { CreateCategory } from './createCategory';
import { CategoryCard } from './CategoryCard';


export function CategoryList() {
    const { categories, loading } = useCategories();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
                <CreateCategory />
            </div>

            {/* Statistics */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border border-border/50">
                    <div className="text-2xl font-bold text-foreground">{categories.length}</div>
                    <div className="text-sm text-muted-foreground">Total Categories</div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                    <div className="text-2xl font-bold text-foreground">
                        {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Subcategories</div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                    <div className="text-2xl font-bold text-foreground">{filteredCategories.length}</div>
                    <div className="text-sm text-muted-foreground">Showing Results</div>
                </div>
            </div> */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Total Categories */}
                <div className="bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent 
                  p-6 rounded-2xl border border-indigo-500/20 
                  shadow-sm hover:shadow-md transition-all duration-300 
                  hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-extrabold text-indigo-600">{categories.length}</div>
                            <div className="text-sm font-medium text-muted-foreground">Total Categories</div>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-600">
                            📂
                        </div>
                    </div>
                </div>

                {/* Total Subcategories */}
                <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent 
                  p-6 rounded-2xl border border-emerald-500/20 
                  shadow-sm hover:shadow-md transition-all duration-300 
                  hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-extrabold text-emerald-600">
                                {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">Total Subcategories</div>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                            📑
                        </div>
                    </div>
                </div>

                {/* Showing Results */}
                <div className="bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent 
                  p-6 rounded-2xl border border-rose-500/20 
                  shadow-sm hover:shadow-md transition-all duration-300 
                  hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-extrabold text-rose-600">{filteredCategories.length}</div>
                            <div className="text-sm font-medium text-muted-foreground">Showing Results</div>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-500/20 text-rose-600">
                            🔍
                        </div>
                    </div>
                </div>
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
                    </div>
                </div>
            </div>



            {/* Categories Grid/List */}
            {sortedCategories.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                        {searchTerm ? 'No categories found matching your search.' : 'No categories yet.'}
                    </div>
                    {!searchTerm && <CreateCategory />}
                </div>
            ) : (
                <div
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                    }
                >
                    {sortedCategories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            )}
        </div>
    );
}