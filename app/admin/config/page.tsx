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
                    <h1 className="text-3xl font-bold mb-8">网站配置</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 网站信息 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>网站信息</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>名称:</strong> {config.site.name}</div>
                                <div><strong>标题:</strong> {config.site.title}</div>
                                <div><strong>描述:</strong> {config.site.description}</div>
                                <div><strong>URL:</strong> {config.site.url}</div>
                                <div><strong>版本:</strong> <Badge variant="secondary">{config.site.version}</Badge></div>
                                <div><strong>作者:</strong> {config.site.author}</div>
                                <div><strong>邮箱:</strong> {config.site.email}</div>
                            </CardContent>
                        </Card>

                        {/* 数据库配置 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>数据库配置</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>类型:</strong> <Badge variant="outline">{config.database.type}</Badge></div>
                                <div><strong>路径:</strong> {config.database.path}</div>
                                <div><strong>主机:</strong> {config.database.host}</div>
                                <div><strong>端口:</strong> {config.database.port}</div>
                                <div><strong>数据库名:</strong> {config.database.name}</div>
                            </CardContent>
                        </Card>

                        {/* 内容配置 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>内容配置</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>目录:</strong> {config.content.directory}</div>
                                <div><strong>支持格式:</strong> {config.content.supportedFormats.join(', ')}</div>
                                <div><strong>默认作者:</strong> {config.content.defaultAuthor}</div>
                                <div><strong>默认标签:</strong> {config.content.defaultTags.join(', ')}</div>
                                <div><strong>每页文章数:</strong> {config.content.pagination.postsPerPage}</div>
                            </CardContent>
                        </Card>

                        {/* 主题配置 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>主题配置</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>默认模式:</strong> <Badge variant="outline">{config.theme.defaultMode}</Badge></div>
                                <div><strong>代码主题:</strong> <Badge variant="outline">{config.theme.codeTheme}</Badge></div>
                                <div><strong>暗色模式:</strong> {config.theme.enableDarkMode ? '启用' : '禁用'}</div>
                            </CardContent>
                        </Card>

                        {/* 功能配置 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>功能配置</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div><strong>搜索:</strong> {config.features.search ? '启用' : '禁用'}</div>
                                <div><strong>标签:</strong> {config.features.tags ? '启用' : '禁用'}</div>
                                <div><strong>评论:</strong> {config.features.comments ? '启用' : '禁用'}</div>
                                <div><strong>统计:</strong> {config.features.analytics ? '启用' : '禁用'}</div>
                                <div><strong>RSS:</strong> {config.features.rss ? '启用' : '禁用'}</div>
                                <div><strong>站点地图:</strong> {config.features.sitemap ? '启用' : '禁用'}</div>
                            </CardContent>
                        </Card>

                        {/* 社交链接 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>社交链接</CardTitle>
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