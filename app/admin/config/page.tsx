import { getConfig } from '@/lib/server-config';
import { MainLayout } from '@/components/layout/main-layout';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ConfigPage() {
    const config = await getConfig();

    return (
        <>
            <MainLayout>
                <div className="max-w-6xl mx-auto py-8">
                    <h1 className="text-3xl font-bold mb-8">Website Configuration</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Website Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Website Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>Name:</strong> {config.site.name}</div>
                                <div><strong>Title:</strong> {config.site.title}</div>
                                <div><strong>Description:</strong> {config.site.description}</div>
                                <div><strong>URL:</strong> {config.site.url}</div>
                                <div><strong>Version:</strong> <Badge variant="secondary">{config.site.version}</Badge></div>
                                <div><strong>Author:</strong> {config.site.author}</div>
                                <div><strong>Email:</strong> {config.site.email}</div>
                            </CardContent>
                        </Card>

                        {/* Database Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Database Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>Type:</strong> <Badge variant="outline">{config.database.type}</Badge></div>
                                <div><strong>Path:</strong> {config.database.path}</div>
                                <div><strong>Host:</strong> {config.database.host}</div>
                                <div><strong>Port:</strong> {config.database.port}</div>
                                <div><strong>Database Name:</strong> {config.database.name}</div>
                            </CardContent>
                        </Card>

                        {/* Content Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>Directory:</strong> {config.content.directory}</div>
                                <div><strong>Supported Formats:</strong> {config.content.supportedFormats.join(', ')}</div>
                                <div><strong>Default Author:</strong> {config.content.defaultAuthor}</div>
                                <div><strong>Default Tags:</strong> {config.content.defaultTags.join(', ')}</div>
                                <div><strong>Posts per Page:</strong> {config.content.pagination.postsPerPage}</div>
                            </CardContent>
                        </Card>

                        {/* Theme Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Theme Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>Default Mode:</strong> <Badge variant="outline">{config.theme.defaultMode}</Badge></div>
                                <div><strong>Code Theme:</strong> <Badge variant="outline">{config.theme.codeTheme}</Badge></div>
                                <div><strong>Dark Mode:</strong> {config.theme.enableDarkMode ? 'Enabled' : 'Disabled'}</div>
                            </CardContent>
                        </Card>

                        {/* Features Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Features Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>Search:</strong> {config.features.search ? 'Enabled' : 'Disabled'}</div>
                                <div><strong>Tags:</strong> {config.features.tags ? 'Enabled' : 'Disabled'}</div>
                                <div><strong>Comments:</strong> {config.features.comments ? 'Enabled' : 'Disabled'}</div>
                                <div><strong>Analytics:</strong> {config.features.analytics ? 'Enabled' : 'Disabled'}</div>
                                <div><strong>RSS:</strong> {config.features.rss ? 'Enabled' : 'Disabled'}</div>
                                <div><strong>Sitemap:</strong> {config.features.sitemap ? 'Enabled' : 'Disabled'}</div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>GitHub:</strong> <a href={config.social.github} target="_blank" className="text-blue-600 hover:underline">{config.social.github}</a></div>
                                <div><strong>Twitter:</strong> <a href={config.social.twitter} target="_blank" className="text-blue-600 hover:underline">{config.social.twitter}</a></div>
                                <div><strong>Discord:</strong> <a href={config.social.discord} target="_blank" className="text-blue-600 hover:underline">{config.social.discord}</a></div>
                                <div><strong>YouTube:</strong> <a href={config.social.youtube} target="_blank" className="text-blue-600 hover:underline">{config.social.youtube}</a></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </MainLayout>
            <Footer />
        </>
    );
} 