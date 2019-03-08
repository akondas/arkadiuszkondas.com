<?php declare(strict_types=1);

namespace Akondas\TextToImage;

use Nette\Utils\Image as Img;

class Image
{
    const ANGLE = 0;

    const FONT = __DIR__ . '/ubuntu.ttf';

    const PADDING = 100;

    const SIGNATURE = 'arkadiuszkondas.com';

    const SIGNATURE_SIZE = 25;

    /**
     * @var Text
     */
    private $text;

    /**
     * @var int
     */
    private $size;

    /**
     * @var int
     */
    private $width;

    public function __construct(string $text, int $size = 100, int $width = 1200)
    {
        $this->size = $size;
        $this->text = new Text($this->size, self::ANGLE, self::FONT, $text);
        $this->width = $width;
    }

    public function get(?string $background = null): Img
    {
        $width = max($this->width, ($this->text->width + self::PADDING));
        $height = floor($width / 16 * 9);

        // Calculate coordinates of the text
        $x = ($width / 2) - ($this->text->width / 2);
        $y = ($height / 2) - ($this->text->height / 2) + $this->size;

        if ($background) {
            $image = Img::fromFile($background);
        } else {
            $image = Img::fromBlank($width, $height, Img::rgb(...Color::BACKGROUND));
        }
        $image->ttfText($this->size, self::ANGLE, $x, $y, Img::rgb(...Color::FOREGROUND), self::FONT, (string) $this->text);
        $image->resize($this->width, null);

        // Add signature
        $image->ttfText(self::SIGNATURE_SIZE, self::ANGLE, $image->width - 380, $image->height - 50, Img::rgb(...Color::SIGNATURE), self::FONT, self::SIGNATURE);

        return $image;
    }
}
